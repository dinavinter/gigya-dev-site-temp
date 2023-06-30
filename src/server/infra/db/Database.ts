import {Collection} from './Collection';
import {Type} from '../service/Service';
import {Injectable} from '../DI';
import {KeyValueStore} from './KeyValueStore';
import {fileExists} from '../utils/files';
import {mkdirSync} from 'fs';

@Injectable()
export class Database {
    public readonly kvStore: KeyValueStore;
    private collections: Map<string, Collection<any>>;

    constructor() {
        this.collections = new Map<string, any>();
        this.kvStore = new KeyValueStore();

        fileExists('.data/').then(exists => {
            if (!exists) {
                mkdirSync('.data/')
            }
        })
    }

    public collection<T>(type: Type<T>) : Collection<T> {
        if (!this.collections.has(type.name)) {
            this.collections.set(type.name, new Collection<T>(type))
        }
        return this.collections.get(type.name);
    }

    public async registerCollection<T>(type: Type<T>) {
        const coll = new Collection<T>(type);
        await coll.init();
        this.collections.set(type.name, coll)
    }

    public getCollections(): string[] {
        return [...this.collections.keys()];
    }
}
