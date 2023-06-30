import {Injectable} from "../DI";

@Injectable()
export class Memcached {
    private memory: {[key: string]: any} = {};
    public set(key: string, value: any, timeout: number) {
        this.memory[key] = value;
        
        setTimeout(() => {
            delete this.memory[key]
        }, timeout);
    }
    
    public get(key: string) {
        return this.memory[key] ?? null;
    }
    
    public revoke() {
        this.memory = {};
    }
}