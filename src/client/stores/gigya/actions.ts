import {createAction, props} from '../store-base';
import type {GigyaEvent, ScreenSet, SDKVersion} from './models';

export const reloadScript = createAction('[Gigya] reload script');
export const gigyaServiceReady = createAction('[Gigya] service ready');
export const screenSetLoaded = createAction('[Gigya] screen-set loaded', props<ScreenSet[]>());
export const newEvent = createAction('[Gigya] new events', props<GigyaEvent>());
export const sdkVersionUpdated = createAction('[Gigya] sdk version updated', props<SDKVersion[]>());
export const loginEvent = createAction('[Gigya] login event', props<{ details: any }>());
export const logoutEvent = createAction('[Gigya] logout event', props<{ details: any }>());
export const errorEvent = createAction('[Gigya] error event', props<{ details: any }>());
