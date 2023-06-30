import {IMiddleware} from "../infra/service/Middleware";
import {AppContext} from "../infra/service/AppContext";
import {SiteConfigController} from "../controllers/site-config/SiteConfigController";
import {CredentialController} from "../controllers/credentials/CredentialController";
import {Injectable} from "../infra/DI";

@Injectable()
export class ContextMiddleware implements IMiddleware {
    constructor(private conf: SiteConfigController, private credentialService: CredentialController) {}
    public use(ctx: AppContext): void {
        ctx.app.use((req, res, next) => {
            const config = this.conf.internalGetConfig()
            ctx.dc = config.dc === 'us1' || config.dc === 'eu1' || config.dc === 'au1' ? 'us1' : config.dc;
            ctx.env = config.env;
            ctx.apiKey = config.site?.apiKey;
            ctx.credential = this.credentialService.getCredentialByDC(ctx.dc);
            next();
        });
    }
}