import type {IMiddleware} from '../infra/service/Middleware';
import {AppContext} from '../infra/service/AppContext';
import {createProxyServer} from 'http-proxy';
import {Injectable} from '../infra/DI';
import {resolveIp} from '../infra/utils/domains';
import {Memcached} from "../infra/db/Memcached";
import {SiteRunController} from "../controllers/site-run/SiteRunController";
import {SiteConfigController} from "../controllers/site-config/SiteConfigController";
import {SiteConfig} from "../controllers/site-config/models";

const proxy = createProxyServer();
@Injectable()
export class GigyaProxyMiddleware implements IMiddleware {
    constructor(private siteRunService: SiteRunController, private conf: SiteConfigController, private memcached: Memcached) {}
    public use(ctx: AppContext) {
        ctx.app.use(async (req, res, next) => {
            const ip = await this.getData(req.hostname);
            if (ip !== 'NA') {
                proxy.web(req, res, {
                    target: {
                        protocol: 'https:',
                        hostname: ip,
                        host: req.hostname
                    },
                    changeOrigin: true,
                    secure: false
                });
            } else {
                next();
            }
        });
    }
    
    private async getData(hostName: string) {
        let ip = this.memcached.get(hostName);
        if (!ip) {
            const config = this.conf.internalGetConfig();
            const siteRun = this.siteRunService.getRunConfiguration(config.runId);
            const site = siteRun.sites.filter(s => s.cname === hostName)[0]
            if (site) {
                ip = await this.resolveTargetIp(site.dc, config);
            } else {
                ip = 'NA';
            }
            this.memcached.set(hostName, ip, 5 * 60 * 1000);
        } 
        return ip 
    }

    private async resolveTargetIp(dc: string, config: SiteConfig) {
        if (dc === 'cn1') {
            dc = `${dc}${config.env !== 'prod' ? '-' + config.env : ''}`
            return await resolveIp(`accounts.${config.env !== 'prod' ? `${dc}` : ''}cn1.sapcdm.cn`);
        }
        return await resolveIp(`farm5.${dc}${config.env !== 'prod' ? '-' + config.env : ''}.gigya.com`);
    }

}