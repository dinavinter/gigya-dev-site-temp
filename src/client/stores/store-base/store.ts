import {derived, writable} from "svelte/store";
import type {Writable, Readable} from 'svelte/store';
import type {Action, ActionCreator} from './action';
import type {Reducer} from './reducer';
import {actionObserver} from './action';

export class Store<S> {
    public readonly state: Writable<S>;
    private readonly reducers: {
        [action: string]: Reducer<S, any>[];
    }

    constructor(initialState: S) {
        this.state = writable(initialState);
        this.reducers = {};
        actionObserver.next.subscribe(action => {
            if (!action) return;
            this.reducers[action.type]?.forEach(r => this.state.update(s =>  r(s, action.props)));
        });
    }

    public on<P extends object>(actionCreator: ActionCreator<P>, reducer: Reducer<S, P>) {
        const action = actionCreator();
        if(!this.reducers[action.type]) {
            this.reducers[action.type] = [];
        }
        this.reducers[action.type].push(reducer);
    }

    public dispatch<P extends object>(action: Action<P>) {
        actionObserver.nextAction(action);
    }

    public select<R>(fn: (state: S) => R = (x => (x as unknown) as R)): Readable<R> {
        return derived(this.state, fn);
    }
}