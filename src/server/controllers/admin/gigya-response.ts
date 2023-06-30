export interface IGigyaResponse {
    errorCode: number;
    callId: string;
    errorDetails?: string;
    errorMessage?: string;
    statusCode?: number;
    statusReason: string;
    time: string;
}

export interface IGetUserSitesResponse extends IGigyaResponse {
    sites: IPartnerSites[];
}

export interface IGetRPSResponse extends IGigyaResponse {
    RPs: RPConfig[];
}
export interface IGetOPSResponse extends IGigyaResponse {
    OPs: OPConfig[];
}

export interface IGetScreenSetResponse extends IGigyaResponse {
    screenSets: ScreenSet[];
}
export interface IAdminSearchResponse extends IGigyaResponse {
    data: any[];
}
export interface IAdminSearchResponse extends IGigyaResponse {
    data: any[];
}
export interface IGetIdPsResponse extends IGigyaResponse {
    configs: any[];
}
export interface IGetSPsResponse extends IGigyaResponse {
    configs: any[];
}
export interface IGetPartnerResponse extends IGigyaResponse {
    partnerID: number;
    secretKey: string;
}
export interface IGetSiteConfigResponse extends IGigyaResponse {
    dataCenter: string;
    baseDomain: string;
    siteID: number;
    customAPIDomainPrefix?: string;
    siteGroupOwner?: string;
    siteGroupConfig?: GroupConfig;
}
export interface GroupConfig {
    enableSSO: boolean;
    members?: string[];
}
export interface ScreenSet {
    screenSetID?: string;
    html?: string;
    css?: string;
    javascript?: string;
    translations?: { [key:string]: object};
}
export interface RPConfig {
    clientID: string;
    description: string;
}
export interface OPConfig {
    providerName: string;
    authorizeEndpoint: string;
}
export interface IPartnerSites {
    partnerID: number;
    tenantID?: string;
    sites: ISite[];
}
export interface ISite {
    siteID: number;
    apiKey: string;
    baseDomain: string;
    description: string;
    dataCenter: string;
}