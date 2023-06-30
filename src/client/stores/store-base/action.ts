import type {Writable} from 'svelte/store';
import {derived, writable} from 'svelte/store';

export class Action<P extends object> {
    constructor(public readonly type: string,
                public readonly props?: P) {}
}

export type ActionCreator<P extends object> = (props?: P) => Action<P>;

export type ActionProps<P extends object> = P

export function props<P extends object>(): P {
    return {} as P;
}

export function createAction<P extends object>(type: string, props?: ActionProps<P>): ActionCreator<P> {
    return props ?
        (props: P) => new Action<P>(type, props) :
        () => new Action<P>(type);
}

class ActionObserver {
    private _actions: Writable<Action<any>[]> = writable([]);

    public get next() {
        return derived(this._actions, actions => {
            if (actions.length) {
                return actions[actions.length - 1];
            }
            return null;
        });
    }

    public nextAction(action: Action<any>) {
        this._actions.update(s => {
            s.push(action)
            return s;
        })
    }
}

export const actionObserver = new ActionObserver();