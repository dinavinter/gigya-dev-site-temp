import 'reflect-metadata';
import {EndpointMeta} from './endpoint-meta';
import {ResponseMeta} from './response-meta';
import {ValidationMeta} from '../validation/Validation';
import {EntityMeta} from '../db/decorators';

export enum MetaType {
    Endpoint = 'dev-server:endpoint',
    Response = 'dev-server:response',
    Validation = 'dev-server:validation',
    Entities = 'dev-server:entities'
}

const defaultMetaValue = (type: MetaType): any => {
    switch (type) {
        case MetaType.Validation:
            return {
                props: {}
            } as ValidationMeta;
        case MetaType.Response:
            return {
                statusCode: {
                    code: 200,
                    useHttpStatusCode: false
                },
                data: {},
                headers: {},
                cookies: {}
            } as ResponseMeta
        case MetaType.Endpoint:
            return {
                path: '',
                routes: {},
                params: {},
                middlewares: []
            } as EndpointMeta
        case MetaType.Entities:
            return {
                name: '',
                pk: null,
                columns: {}
            } as EntityMeta
    }
}

export function updateMeta<T>(type: MetaType, target: any, updated: (meta: T) => T) {
    let meta = getMeta<T>(type, target);

    meta = updated(meta);
    Reflect.defineMetadata(type, meta, target);
}

export function getMeta<T>(type: MetaType, target: any): T {
    return (Reflect.getMetadata(type, target) ?? defaultMetaValue(type)) as T;
}