import {getMeta, MetaType, updateMeta} from '../meta-data/meta';
import {forOwn as _forOwn, isNil as _isNil, isString as _isString, includes as _include, isEmpty as _isEmpty, isBoolean as _isBoolean, isArray as _isArray} from 'lodash';
import {Type} from '../service/Service';

export interface IValidatorData {
    fieldName: string;
    value: any;
}

export interface IValidator {
    validator: (value: any) => boolean;
    errorMessage: (data: IValidatorData) => string;
}

export interface ValidationMeta {
    props: { [key: string]: IValidator[] };
}

export const required: IValidator = {
    validator: value => !(_isNil(value) || _isEmpty(value)),
    errorMessage: data => `'${data.fieldName}' is required`
};

export const isString: IValidator = {
    validator: (value) => _isNil(value) || _isString(value),
    errorMessage: data => `'${data.fieldName}' should be a string`
}

export const isBoolean: IValidator = {
    validator: _isBoolean,
    errorMessage: data => `'${data.fieldName}' should be a boolean`
}

export const isStringArray: IValidator = {
    validator:(items) => _isArray(items) && (items.length === 0 || items.filter(_isString).length > 0),
    errorMessage: data => `'${data.fieldName}' should be a string array`
}

export const isArray: IValidator = {
    validator: _isArray,
    errorMessage: data => `'${data.fieldName}' should be an array`
}

export const isEnum = (values: string[] | number[]): IValidator => {
    return {
        validator: value => _include(values, value),
        errorMessage: data => `'${data.fieldName}' should be one of [${values.join(', ')}] but was '${data.value}'`
    }
}

export function Prop(...validators: IValidator[]): PropertyDecorator {
    return (target, propertyKey) => {
        updateMeta<ValidationMeta>(MetaType.Validation, target, meta => {
            const key = propertyKey.toString();
            meta.props[key] = validators || [];
            return meta;
        });
    }
}
export function validate<T>(obj: any, type: Type<T>): T {
    const instance = new type() as any;
    const meta = getMeta<ValidationMeta>(MetaType.Validation, instance);
    _forOwn(meta.props, (validators, fieldName) => {
        for (const v of validators) {
            if (!v.validator(obj[fieldName])) {
                throw v.errorMessage({
                    fieldName,
                    value: obj[fieldName]
                });
            }
        }
        instance[fieldName] = obj[fieldName];
    });

    return instance;
}
