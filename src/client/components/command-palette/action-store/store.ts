import {createSelector, Store} from '../../../stores/store-base';
import {actions} from './initial-state';
import {setChildActions, execAction, popAction, reset} from './actions';

export const actionStore = new Store({
    actions: actions,
    stack: [],
});

actionStore.on(reset, s => {
    s.stack = [];
    return s;
})

actionStore.on(popAction, s => {
    s.stack.pop();
    return s;
});

actionStore.on(execAction, (s, action) => {
    if (action.exec) {
        if (action.exec()) {
            s.stack = [];
        } else {
            s.stack.push(action);
        }
    } else {
        s.stack.push(action);
    }
    return s
});

actionStore.on(setChildActions, (s, actions) => {
    s.stack[s.stack.length-1].children = actions;
    return s;
});

export const state = actionStore.select(s => s);
export const stack = createSelector(state, s => s.stack);
export const displayActions = createSelector(state, (s) => {
    if (!s.stack.length) {
        return s.actions;
    }
    return s.stack[s.stack.length-1].children;
});