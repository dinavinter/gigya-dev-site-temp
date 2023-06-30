
export interface GigyaState {
    reload: boolean;
    isGigyaServiceReady: boolean;
    screenSets: ScreenSet[];
    events?: {
        type: 'login' | 'logout' | 'error',
        details: any
    };
    sdkVersion: SDKVersion[];
    hasSession: boolean;
}

export interface GigyaEvent {
    eventName: string;
    timestamp: number;
    details: any;
}

export interface ScreenSet {
    screenSetId: string;
    screens: string[];
}

export interface SDKVersion {
    version: string;
    build: string;
}