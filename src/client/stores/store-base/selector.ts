import type {Readable, Writable} from 'svelte/store';
import {derived} from 'svelte/store';

export type StoreTypes<S> = Readable<S> | Writable<S>;

export type Stores = Readable<any> | [Readable<any>, ...Array<Readable<any>>] | Array<Readable<any>>;

export declare type StoresValues<T> = T extends Readable<infer U> ? U : {
    [K in keyof T]: T[K] extends Readable<infer U> ? U : never;
};

export type SelectorFunction<S extends Stores, R> = (values: StoresValues<S>) => R

export function createSelector<S extends Stores, R>(stores: S, fn: SelectorFunction<S, R>): Readable<R> {
    return derived(stores, fn);
}