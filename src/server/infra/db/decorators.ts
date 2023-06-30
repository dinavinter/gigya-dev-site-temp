import {MetaType, updateMeta} from '../meta-data/meta';

export interface IColumnOptions {
    name?: string;
    default?: any;
    primary?: boolean;
    generated?: boolean;
}

export interface ColumnMeta {
    name: string;
    defaultValue: any;
    primary: boolean;
    generated: boolean;
}

export interface EntityMeta {
    name: string;
    pk: string;
    columns: { [key: string]: ColumnMeta };
}

export function Entity(name?: string): ClassDecorator {
    return target => {
        updateMeta<EntityMeta>(MetaType.Entities, target.prototype, meta => {
           meta.name = name ?? target.name;
           return meta;
        });
    }
}

export function Column(options?: IColumnOptions): PropertyDecorator {
    return (target, propertyKey) => {
        updateMeta<EntityMeta>(MetaType.Entities, target, meta => {
            const name = options?.name ?? propertyKey.toString();
            if (!meta.columns[name]) {
                meta.columns[name] = {
                    name: name,
                    generated: options?.generated ?? false,
                    primary: options?.primary ?? false,
                    defaultValue: options?.default ?? null
                };
                if (meta.columns[name].primary) {
                    meta.pk = name;
                }
            } else {
                throw `column '${name}' is already exists`
            }
            return meta;
        });
    }
}