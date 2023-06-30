export interface GigSite{
    siteId: number;
    apiKey: string;
    baseDomain: string;
    dc: string;
    partnerId: number;
    tenantId: string;
    customApiPrefix?: string;
    screenSetIds: string[];
    sso: {
        enabled: boolean;
        isGroupOwner: boolean;
        members?: string[];
    }
    saml: {
        enabled: boolean;
        isIDP: boolean;
        registeredIdPs?: string[];
    };
    oidc: {
        enabled: boolean;
        isOp: boolean;
        registeredOPs?: string[];
    };
}

export interface SiteRunConfiguration {
    siteId: number;
    apiKey: string;
    baseDomain: string;
    dc: string;
    defaultScreenSetId: string;
    cname?: string;
    sso?: 'Parent' | 'Child';
    saml?: 'IdP' | 'SP';
    registeredIdPs?: string[]
    oidc?: 'OP' | 'RP';
    registeredOPs?: string[];
}

export interface RunConfiguration {
    id: string;
    tags: string[];
    sites: SiteRunConfiguration[];
}