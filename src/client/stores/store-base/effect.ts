import type {Readable, Writable} from 'svelte/store';
import {get, writable} from 'svelte/store';
import type {Action, ActionCreator} from './action';
import {isArray} from 'lodash';
import {actionObserver} from './action';
import type {Stores, StoresValues} from './selector';

type Waitable<T> = T | Promise<T>;

type EffectMap = {
    [key: string] : Effect<any, any>[];
}

export type EffectFunc<P extends object, S extends Stores> = (props: P, ...states: StoresValues<S>) => Waitable<Action<any> | Action<any>[]>

export type Effect<P extends object, S extends Stores> = {
    effectFunc: EffectFunc<P, S>;
    states: S
};
export function createEffect<P extends object, S extends Stores>(actionCreator: ActionCreator<P>, states: S, effect: EffectFunc<P, S>): void {
    effectManager.addEffect(actionCreator, states, effect);
}

class EffectManager {
    private _effects: Writable<EffectMap> = writable({});

    constructor() {
        actionObserver.next.subscribe(action => {
            if (!action) return;
            const effects = get(this._effects);
            effects[action.type]?.forEach(async (e) => {
                let stores = isArray(e.states) ?
                    e.states as Array<Readable<any>> :
                    [e.states as Readable<any>];
                const values = stores.map(s => get(s));

                let result = await e.effectFunc(action.props, ...values);
                if (!isArray(result)) {
                    result = [result];
                }
                result.forEach((a: Action<any>) => actionObserver.nextAction(a));
            });
        });
    }

    public addEffect<P extends object, S extends Stores>(actionCreator: ActionCreator<P>, states: S, effect: EffectFunc<P, S>) {
        this._effects.update(effects => {
            const action = actionCreator();
            if (!effects[action.type]) {
                effects[action.type] = [];
            }
            effects[action.type].push({
                effectFunc: effect,
                states: states
            });
            return effects;
        })
    }
}

export const effectManager = new EffectManager();