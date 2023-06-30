import {RequestHandler} from 'express';
import {Type} from '../service/Service';

export type HttpMethods = 'all' | 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head';
export type ParamType = 'response' | 'request' | 'next' | 'query' | 'body' | 'cookie' | 'header' | 'param' | 'context';

export interface RouteMeta {
    path: string;
    method: HttpMethods;
    middlewares?: RequestHandler[];
}

export interface ParamMeta {
    index: number;
    paramType: ParamType;
    name: string;
    type: Type<any>;
}

export interface EndpointMeta {
    path: string;
    routes?: {
        [key:string | symbol]: RouteMeta
    };
    params?: {
        [key: string | symbol]: ParamMeta[]
    };
    middlewares?: RequestHandler[];
}