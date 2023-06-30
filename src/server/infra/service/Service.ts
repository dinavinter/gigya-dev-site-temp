import {ServerOptions} from 'http';
import {ServiceBase} from './ServiceBase';
import {IMiddleware} from './Middleware';

export interface Type<T> {
    new (...args: any[]): T;
}

export interface ServiceOptions {
    port: number;
    serviceName: string;
    secure?: boolean;
    middlewares?: Type<IMiddleware>[];
    endpoints?: Type<any>[];
    serverOptions?: ServerOptions;
}

// Mock service type for ts unknown type issues
export class IService {
    async listen() {}
}

export function Service({ port, serviceName,  middlewares = [], endpoints = [], serverOptions = null, secure = false }: ServiceOptions) {
    return function (CType: Type<any>)  {
        return class extends CType {
            async listen() {
                const srv = new ServiceBase(port, serviceName, secure, serverOptions);
                srv.registerMiddlewares(...middlewares);
                srv.registerRoutes(...endpoints);
                await srv.listen();
            }
        }
    }
}