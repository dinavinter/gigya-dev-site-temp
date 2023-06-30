import {createAction, props} from '../store-base';

export type ToastProp = {
    message: string;
    timeout?: number;
}

export const showSuccessToast = createAction('[Show Success Toast]', props<ToastProp>());
export const showErrorToast = createAction('[Show Error Toast]', props<ToastProp>());
export const showInfoToast = createAction('[Show Info Toast]', props<ToastProp>());
export const showWarningToast = createAction('[Show Warning Toast]', props<ToastProp>());
export const removeToast = createAction('[Remove Toast]', props<{id: string}>());