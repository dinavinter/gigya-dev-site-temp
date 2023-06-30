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

export interface SiteSettings {
    dc: DC;
    env: Envs;
    apiKey: string;
    version: string;
    defaultScreenSetId: string;
    oidcProviders: string[];
    samlProviders: string[];
}