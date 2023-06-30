import {uid} from '../../utils/unique-id-generator';
import {Store} from '../store-base';
import {removeToast, showErrorToast, showInfoToast, showSuccessToast, showWarningToast} from './actions';
import type {ToastProp} from './actions';
import type {Toast, ToastType} from './models';

const defaultToastTimeout = 4000;
function showToast(type: ToastType) {
    return (state: Toast[], {message, timeout = defaultToastTimeout}: ToastProp) => {
        const newToast = {
            id: uid(),
            message,
            timeout,
            type
        };
        return [
            ...state,
            newToast
        ];
    }
}


export const toastStore = new Store<Toast[]>([]);

toastStore.on(showSuccessToast, showToast('success'));
toastStore.on(showErrorToast, showToast('danger'));
toastStore.on(showWarningToast, showToast('warning'));
toastStore.on(showInfoToast, showToast('info'));
toastStore.on(removeToast, (state, props) => {
    return state.filter(t => t.id !== props.id);
});

export const allToast = toastStore.select(x => x);