export interface Action {
    id: string;
    label: string;
    children?: Action[];
    exec?: () => boolean;
}

export type ActionStoreState = {
    stack: Action[];
    actions: Action[];
}