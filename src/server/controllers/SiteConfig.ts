import {Context, Endpoint, Get, Post} from '../infra/service/Endpoint';
import {AppContext} from '../infra/service/AppContext';
import {isEnum, isString, Prop, required} from '../infra/validation/Validation';
import {SuccessResponse} from '../infra/service/common-responses';
import {JsonProperty} from '../infra/meta-data/response-meta';
import {Database} from '../infra/db/Database';

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
}

class GetSiteConfigResponse {
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
    oidcProviders: string[];
    @JsonProperty()
    samlProviders: string[];
}

@Endpoint('/config')
export class SiteConfigController {
    static SiteConfigKey = 'site-config';
    constructor(private db: Database) {
    }


    @Get()
    public async getConfig(@Context() ctx: AppContext) {
        let config = this.db.cache.get(SiteConfigController.SiteConfigKey);
        let currentSite = this.db.cache.get(ctx.request.hostname);

        if (!config) {
            config = new SiteConfig();
            this.db.cache.set(SiteConfigController.SiteConfigKey, config);
        }
        const response = new GetSiteConfigResponse();
        response.dc = currentSite?.dc || config?.dc;
        response.env = config?.env;
        response.apiKey = currentSite?.apiKey;
        response.version = config?.version;
        response.defaultScreenSetId = currentSite?.defaultScreenSetId;
        response.samlProviders = currentSite?.samlProviders;
        response.oidcProviders = currentSite?.oidcProviders;

        return response;
    }

    @Post()
    public async setConfig(@Context() ctx: AppContext) {
        const dc = ctx.body(SiteConfig);
        this.db.cache.set(SiteConfigController.SiteConfigKey, dc);
        return new SuccessResponse();
    }
}
