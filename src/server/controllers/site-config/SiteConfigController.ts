import { Memcached } from "../../infra/db/Memcached";
import { Database } from "../../infra/db/Database";
import {Context, Endpoint, Get, Post} from "../../infra/service/Endpoint";
import {AppContext} from "../../infra/service/AppContext";
import {GetSiteConfigResponse, SiteConfig} from "./models";
import {SuccessResponse} from "../../infra/service/common-responses";
import {SiteRunController} from "../site-run/SiteRunController";

@Endpoint('/config')
export class SiteConfigController {
    static SiteConfigKey = 'site-config';
    constructor(private db: Database, private memcached: Memcached) {
    }
    
    @Get()
    public async getConfig(@Context() ctx: AppContext) {
        let config = this.internalGetConfig();
        
        const response = new GetSiteConfigResponse();
        response.dc = config.dc;
        response.env = config.env;
        response.apiKey = config.site?.apiKey;
        response.version = config.version;
        response.defaultScreenSetId = config.site?.defaultScreenSetId;
        response.samlProviders = config.site?.registeredIdPs;
        response.oidcProviders = config.site?.registeredOPs;

        return response;
    }

    @Post()
    public async setConfig(@Context() ctx: AppContext) {
        const conf = ctx.body(SiteConfig);
        this.internalSetConfig(conf);
        return new SuccessResponse();
    }
    
    public internalSetConfig(conf: SiteConfig) {
        this.db.kvStore.set(SiteConfigController.SiteConfigKey, conf);
        this.memcached.revoke();
    }

    public internalGetConfig(): SiteConfig {
        let config = this.db.kvStore.get(SiteConfigController.SiteConfigKey);

        if (!config) {
            config = new SiteConfig();
            this.db.kvStore.set(SiteConfigController.SiteConfigKey, config);
        }
        return config
    }
}
