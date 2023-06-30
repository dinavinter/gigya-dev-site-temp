export type ToastType = '' | 'info' | 'success' | 'warning' | 'danger'
export class Toast {
    id?: string;
    message: string;
    timeout?: number;
    type?: ToastType
}