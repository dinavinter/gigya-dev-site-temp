import {fileExists, readJSONFile, writeJSONFile} from '../utils/files';
import {debounce} from '../utils/time';

const KEY_VALUE_FILE_PATH = '.data/kv.json'

export class KeyValueStore {
    private data: { [key: string]: string } = {};
    private syncDebounce = debounce(this.sync, 500);

    public constructor() {
        this.loadData()
    }

    public set(key: string, value: any) {
        this.data[key] = value;
        this.syncDebounce(this);
    }

    public get(key: string): any {
        return this.data[key] || null;
    }

    public remove(key: string) {
        if (this.data[key]) {
            delete this.data[key];
        }
        this.syncDebounce(this);
    }

    private async sync() {
        await writeJSONFile(KEY_VALUE_FILE_PATH, this.data);
    }

    private async loadData() {
        if (!(await fileExists(KEY_VALUE_FILE_PATH))) {
            await writeJSONFile(KEY_VALUE_FILE_PATH, {});
            this.data = {};
            return;
        }
        this.data = await readJSONFile(KEY_VALUE_FILE_PATH)
    }
}
