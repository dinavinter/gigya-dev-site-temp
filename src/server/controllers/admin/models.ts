import {JsonProperty} from "../../infra/meta-data/response-meta";

export class UserSite {
    partnerId: number;
    siteId: number;
    apiKey: string;
    baseDomain: string;
    dc: string;
    tenantId: string;
}
export class SiteConfig {
    siteId?: number;
    apiKey?: string;
    baseDomain?: string;
    dc?: string;
    customApiPrefix?: string;
    screenSetIds?: string[];
    sso?: {
        enabled: boolean;
        isGroupOwner: boolean;
        members?: string[];
    }
    saml?: {
        enabled: boolean;
        isIDP: boolean;
        registeredIdPs?: string[];
    };
    oidc?: {
        enabled: boolean
        isOp: boolean;
        registeredOPs?: string[];
    };
}
export class SDKVersionResponse {
    constructor(data: any) {
        this.versions = data;
    }
    @JsonProperty()
    public versions: any;
}
export class UserSiteResponse {
    constructor(data: UserSite[]) {
        this.sites = data;
    }
    @JsonProperty()
    public sites: UserSite[]
}
export class SiteConfigResponse {
    constructor(data: SiteConfig) {
        this.siteConfig = data;
    }
    @JsonProperty()
    public siteConfig: SiteConfig;
}
