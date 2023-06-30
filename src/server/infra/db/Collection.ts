import {Type} from '../service/Service';
import {EntityMeta} from './decorators';
import {getMeta, MetaType} from '../meta-data/meta';
import {debounce} from '../utils/time';
import {fileExists, readJSONFile, writeJSONFile} from '../utils/files';

export class Collection<T> {
    private readonly entityMetadata: EntityMeta;
    private readonly indexes: Map<any, number>;
    private readonly rawData: T[];
    private syncDebounce = debounce(this.sync, 500);

    private get data(): T[] {
        return this.rawData.filter(s => !!s);
    }

    private get filePath(): string {
        return `.data/${this.entityMetadata.name}.json`;
    }

    private get pk(): any {
        return this.entityMetadata.pk;
    }

    constructor(type: Type<T>) {
        const target = new type();
        this.entityMetadata = getMeta<EntityMeta>(MetaType.Entities, target);
        if (!this.entityMetadata.pk) {
            throw 'Entity must have primary key'
        }
        this.rawData = [];
        this.indexes = new Map<any, number>();
    }

    public async init() {
        if (!(await fileExists(this.filePath))) {
            await writeJSONFile(this.filePath, []);
        } else {
            const rawData = await readJSONFile<T[]>(this.filePath);

            for (const row of rawData) {
                this.insert(row);
            }
        }
    }

    public insert(item: T) {
        if (this.exists(item)) {
            throw `Duplicate primary key - ${(item as any)[this.pk]}`;
        }
        this.rawData.push(item)
        this.indexes.set((item as any)[this.pk], this.rawData.length - 1);
        this.syncDebounce(this);
    }

    public update(item: T): boolean {
        if (!this.exists(item)) {
            return false;
        }
        const index = this.indexes.get((item as any)[this.pk]);
        Object.assign(this.rawData[index], item);
        this.syncDebounce(this);
        return true;
    }

    public delete(item: T): boolean {
        if (!this.exists(item)) {
            return false;
        }
        const index = this.indexes.get((item as any)[this.pk]);
        this.rawData[index] = null;
        this.indexes.delete((item as any)[this.pk]);
        this.syncDebounce(this);
        return true;
    }

    public find(filterBy?: (item: T) => boolean): T[] {
        return filterBy ?
                this.data.filter(filterBy):
                this.data;
    }

    public findById(id: string): T {
        const index = this.indexes.get(id);
        return this.rawData[index];
    }

    public exists(item: T): boolean {
        return this.indexes.has((item as any)[this.pk]);
    }

    private async sync() {
        await writeJSONFile(this.filePath, this.data);
    }
}

