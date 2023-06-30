import {Type} from './service/Service';

export function Injectable(): ClassDecorator {
    return target => {
        Injector.bind(target.name, target as any);
    }
}

interface InjectedData {
    type: any;
    instance: any;
}

export const Injector = new class {
    private typeMap = new Map<string, InjectedData>();

    public bind(key: string, target: any) {
        if (this.typeMap.has(key)) {
            throw `Token '${key}' is already exists`
        }

        this.typeMap.set(key, {
            type: target,
            instance: null
        });
    }

    public resolve<T>(target: Type<any>): T {
        if (!target || !this.typeMap.has(target.name)) {
            return null;
        }

        if (!this.typeMap.get(target.name).instance) {
            let tokens = Reflect.getMetadata('design:paramtypes', target) || [];
            let injections = tokens.map((t: Type<any>) => Injector.resolve<any>(t));

            this.typeMap.get(target.name).instance = new target(...injections);
        }
        return this.typeMap.get(target.name).instance;
    }
}