export enum BulmaColor {
    White = 'white',
    Light = 'light',
    Dark = 'dark',
    Black = 'black',
    Primary = 'primary',
    Link = 'link',
    Info = 'info',
    Success = 'success',
    Warning = 'warning',
    Danger = 'danger'
}

export enum DC {
    US = 'us1',
    EU1 = 'eu1',
    EU2 = 'eu2',
    AU = 'au1',
    CN = 'cn1',
    IL = 'il3',
}

type envs = 1 | 2
export type Envs = 'prod' | `st${envs}`