import {createAction, props} from '../../../stores/store-base';
import type {Action} from './model';

export const execAction = createAction('[Action] exec', props<Action>());
export const reset = createAction('[Action] reset');
export const popAction = createAction('[Action] pop');
export const setChildActions = createAction('[Action] set child actions', props<Action[]>());