import {IService, Service} from '../infra/service/Service';
import {ForceHttpsMiddleware} from '../middlewares/ForceHttps';
import {BaseMiddleware} from '../middlewares/BaseMiddleware';

@Service({
    port: 80,
    serviceName: 'HTTP Service',
    secure: false,
    middlewares: [
        BaseMiddleware,
        ForceHttpsMiddleware
    ]
})
export class HttpService extends IService{
}