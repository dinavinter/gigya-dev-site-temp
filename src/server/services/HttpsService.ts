import {IService, Service} from '../infra/service/Service';
import {CertificateManager} from '../infra/CertificateManager';
import {ServerOptions} from 'http';
import {BaseMiddleware} from '../middlewares/BaseMiddleware';
import {ViteMiddleware} from '../middlewares/ViteMiddleware';
import {GigyaProxyMiddleware} from '../middlewares/GigyaProxyMiddleware';
import {LoggerMiddleware} from '../middlewares/LoggerMiddleware';
import {ContextMiddleware} from "../middlewares/ContextMiddleware";
import {CredentialController} from "../controllers/credentials/CredentialController";
import {SiteConfigController} from "../controllers/site-config/SiteConfigController";
import {HostsController} from "../controllers/hosts/HostsController";
import {GigyaAdminController} from "../controllers/admin/GigyaAdminController";
import {SiteRunController} from "../controllers/site-run/SiteRunController";

export const serverOptions = {
    SNICallback: async (domain: string, cb: Function) => {
        let context = await CertificateManager.getCertificate(domain);
        cb(null, context);
    },
    key: CertificateManager.defaultKey,
    cert: CertificateManager.defaultCert
} as ServerOptions

@Service({
    port: 443,
    serviceName: 'HTTPS service',
    secure: true,
    serverOptions,
    middlewares: [
        LoggerMiddleware,
        ContextMiddleware,
        GigyaProxyMiddleware,
        BaseMiddleware,
        ViteMiddleware,
    ],
    endpoints: [
        CredentialController,
        SiteConfigController,
        HostsController,
        GigyaAdminController,
        SiteRunController
    ]
})
export class HttpsService extends IService {
}