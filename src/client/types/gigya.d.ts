declare global {
    interface Window {
        gigya: any;
    }
}

declare namespace gigya {
    let apiKey: string;
    let dataCenter: string;
    let sso: any;
    let fidm: any;
    let utils: any;
    let partnerSettings: {
        baseDomains: string;
        customAPIDomainPrefix?: string;
        ssoKey?: string;
    };
    let thisScript: {
        APIKey: string;
        globalConf: {
            APIKey: string;
            apiDomain: string;
            lang: string;
            sessionExpiration: number;
            storageDomainOverride?: string;
        }
    };
    let build: {
        version: string;
        number: number;
    }
    let defaultEventMaps: IEventMapConfig[];

    function hasSession(): Promise<boolean>;

    interface IEventMapConfig {
        id: string;
        defaultMethod: (event: any) => void;
        eventMap: {
           events: string;
           args: any[];
           method?: (event: any) => void;
        }[]
    }

    interface GigyaRequest<T extends GigyaResponse> {
        callback?: (response: T) => void;
    }
    interface GigyaResponse {
        statusCode: number;
        errorCode: number;
        callId: string;
        errorMessage: string;
    }
    namespace accounts {
        function getScreenSets(params: ScreenSetParams);
        function showScreenSet(params?: any);
        function hideScreenSet(params?: any);
        function logout(params?: any);
        function addEventHandlers(params?: any);

        interface ScreenSet {
            screenSetID?: string;
            html?: string;
            css?: string;
            javascript: string;
            translation: { [key: string]: { [key: string]: string }}
        }
        interface ScreenSetResponse extends GigyaResponse {
            screenSets: ScreenSet[];
        }
        interface ScreenSetParams extends GigyaRequest<ScreenSetResponse> {
            screenSetIDs?: string;
            include?: string;
            lang?: string;
            ignoreInterruptions?: boolean
        }
    }

    namespace _ {
        let config: {
            flags: { [key: string]: boolean }
        };
    }
}