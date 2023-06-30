import {MetaType, updateMeta} from './meta';
import {set as _set} from 'lodash';

export interface ResponseMeta {
    statusCode: {
        code: number;
        useHttpStatusCode: boolean;
    };
    data: Object;
    headers: { [key: string]: string; };
    cookies: { [key: string]: string; };
}

function responseKeyFactory(type: 'data' | 'statusCode' | 'headers' | 'cookies', key: string = null, defaultValue: any = null): PropertyDecorator {
    return (target, propertyKey) => {
        let path = `${type}`;
        if (type !== 'statusCode') {
             path += `.${key || propertyKey.toString()}`;
        }
        let value: any = undefined;
        const getter = (): any => {
            return value;
        }

        const setter = (newValue: any) => {
            updateMeta<ResponseMeta>(MetaType.Response, target, meta => {
                return _set(meta, path, newValue)
            });
            value = newValue;
        }

        if (defaultValue) setter(defaultValue);
        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter
        });
    }
}

export const StatusCode = (defaultValue?: number, useHttpStatusCode = false) => responseKeyFactory('statusCode', null, {
    code: defaultValue,
    useHttpStatusCode
});
export const SetCookie = (name?: string) => responseKeyFactory('cookies', name);
export const Header = (name?: string) => responseKeyFactory('headers', name);
export const JsonProperty = (name?: string) => responseKeyFactory('data', name);