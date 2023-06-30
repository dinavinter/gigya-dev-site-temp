export interface Reducer<T, P extends object> {
    (state: T, props?: P): T;
}