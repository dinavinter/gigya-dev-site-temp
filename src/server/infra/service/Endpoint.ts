import {MetaType, updateMeta} from '../meta-data/meta';
import {Injector} from '../DI';
import {HttpMethods, ParamType, EndpointMeta} from '../meta-data/endpoint-meta';

export function Endpoint(path: string): ClassDecorator {
    return target => {
        Injector.bind(target.name, target as any);
        updateMeta<EndpointMeta>(MetaType.Endpoint, target.prototype, meta => {
            meta.path = path.startsWith('/') ? path : `/${path}`;
            return meta;
        });
    }
}

function methodFactory(method: HttpMethods) {
    return function (path: string = '/'): MethodDecorator {
        return (target, propertyKey) => {
            updateMeta<EndpointMeta>(MetaType.Endpoint, target, meta => {
                meta.routes[propertyKey] = { path:  path.startsWith('/') ? path : `/${path}`, method };
                return meta;
            });
        }
    }
}

function paramFactory(paramType: ParamType) {
    return function (name?: string, useRequestObject: boolean = false): ParameterDecorator {
        return (target, propertyKey, index) => {
            const type = Reflect.getMetadata("design:type", target, propertyKey);
            updateMeta<EndpointMeta>(MetaType.Endpoint, target, meta => {
                if (!meta.params[propertyKey]) {
                    meta.params[propertyKey] = [];
                }
                meta.params[propertyKey].push({index, paramType: paramType, name, type});
                return meta;
            });
        }
    }
}

export const Get = methodFactory('get');
export const Post = methodFactory('post');
export const Put = methodFactory('put');
export const Patch = methodFactory('patch');
export const Delete = methodFactory('delete');
export const Options = methodFactory('options');
export const Head = methodFactory('head');

export const Context = paramFactory('context')
export const Response = paramFactory('response');
export const Request = paramFactory('request');
export const Next = paramFactory('next');
export const Param = paramFactory('param');
export const Query = paramFactory('query');
export const Cookie = paramFactory('cookie');
export const Body = paramFactory('body');
export const Header = paramFactory('header');