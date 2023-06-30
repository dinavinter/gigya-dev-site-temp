import e from 'express';
import {validate} from '../validation/Validation';
import {Type} from './Service';
import {Credential} from "../../controllers/credentials/models";

export class ExecutionContext {
    constructor(
        public request?: e.Request,
        public response?: e.Response,
        public next?: e.NextFunction
    ){}
}

export class AppContext {
    constructor(
        public readonly app: e.Express,
        public executionContext: ExecutionContext = null,
        public dc: string = 'us1',
        public env: string = 'prod',
        public apiKey: string = null,
        public credential: Credential = null) {
    }
    
    public get request() {
        return this.executionContext?.request;
    }

    public get response() {
        return this.executionContext?.response;
    }

    public get next() {
        return this.executionContext?.next();
    }

    public params(name?: string) {
        if (name) {
            return this.request.params[name] || null;
        }
        return this.request.params;
    }

    public query(name?: string) {
        if (name) {
            return this.request.query[name] || null;
        }
        return this.request.query;
    }

    public body<T>(type: Type<T>, name?: string): T {
        let rawValue;
        if (name) {
            rawValue = this.request.body[name] || null;
        } else {
            rawValue = this.request.body;
        }
        return validate(rawValue, type) ;
    }

    public rawBody(name?: string): any {
        if (name) {
            return this.request.body[name] || null;
        }
        return this.request.body;
    }

    public cookies(name?: string) {
        if (name) {
            return this.request.cookies[name] || null;
        }
        return this.request.cookies;
    }

    public header(name?: string) {
        if (name) {
            return this.request.header(name) || null;
        }
        return this.request.headers;
    }

    public sendFile(path: string) {
        return this.response.sendFile(path);
    }
}