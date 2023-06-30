import {isEnum, isString, required} from "../../infra/validation/Validation";
import { Prop } from "../../infra/validation/Validation";
import {JsonProperty} from "../../infra/meta-data/response-meta";
import {SiteData} from "../site-run/models";

export class SiteConfig {
    constructor() {
        this.env = 'prod';
        this.dc = 'us1';
        this.version = 'latest';
    }
    @Prop(required, isEnum(['us1', 'eu1', 'cn1', 'au1', 'eu2', 'il3']))
    dc: string;

    @Prop(required, isEnum(['prod', 'st1', 'st2', 'st7']))
    env: string;

    @Prop(required, isString)
    version: string;

    runId: string;
    
    site?: SiteData;
}

export class GetSiteConfigResponse {
    @JsonProperty()
    dc: string;
    @JsonProperty()
    env: string;
    @JsonProperty()
    apiKey: string;
    @JsonProperty()
    version: string;
    @JsonProperty()
    defaultScreenSetId: string;
    @JsonProperty()
    samlProviders: string[];
    @JsonProperty()
    oidcProviders: string[];
}