import express, {Express, NextFunction, Request, Response, Router} from 'express';
import http, {ServerOptions} from 'http';
import https from 'https';
import {Type} from './Service';
import {getMeta, MetaType} from '../meta-data/meta';
import {Injector} from '../DI';
import {AppContext, ExecutionContext} from './AppContext';
import {IMiddleware} from './Middleware';
import {EndpointMeta, ParamMeta} from '../meta-data/endpoint-meta';
import {ResponseMeta} from '../meta-data/response-meta';
import {Database} from "../db/Database";

export class ServiceBase {
    private readonly app: Express;
    private readonly db: Database;
    private readonly appContext: AppContext;
    public constructor(private port: number, private name: string, private secure: boolean, private serverOptions: ServerOptions) {
        this.app = express();
        this.db = Injector.resolve(Database);
        this.appContext = new AppContext(this.app);
    }

    public registerMiddlewares(...middlewares: Type<IMiddleware>[]) {
        for (const Middle of middlewares) {
            const m = Injector.resolve(Middle) as IMiddleware;
            m.use(this.appContext);
        }
    }

    public registerRoutes(...routes: Type<any>[]) {
        if (routes.length === 0) return;
        const tableRoutes = [];
        for (const r of routes) {
            const ctrl = Injector.resolve<any>(r);
            const {routes, params, path} = getMeta<EndpointMeta>(MetaType.Endpoint, ctrl);
            const router = Router();

            for (const key in routes) {
                const routeMeta = routes[key];
                const routeHandler = async (req: Request, res: Response, next: NextFunction) => {
                    const args = await this.extractParameters(req, res, next, params[key]);
                    try {
                        const response = await ctrl[key].apply(ctrl, args);
                        const resMeta = getMeta<ResponseMeta>(MetaType.Response, response);
                        if (resMeta.statusCode.useHttpStatusCode) {
                            res.status(resMeta.statusCode.code);
                        } else {
                            res.status(200);
                        }
                        for(const c in resMeta.cookies) {
                            res.cookie(c, resMeta.cookies[c]);
                        }
                        for(const h in resMeta.headers) {
                            res.setHeader(h, resMeta.headers[h]);
                        }
                        res.json({
                            success: resMeta.statusCode.code >= 200 && resMeta.statusCode.code < 300,
                            statusCode: resMeta.statusCode.code,
                            ...resMeta.data
                        });
                    } catch (e) {
                        console.error(e);
                        res.status(200);
                        res.json({
                            success: false,
                            statusCode: 500,
                            message: "Internal server error",
                            error: e
                        });
                    }
                }
                tableRoutes.push({
                    Path: `${path === '/' ? '' : path}${routeMeta.path}`,
                    Method: routeMeta.method.toUpperCase(),
                    Handler: `${r.name}.${key}`
                });
                router[routeMeta.method].apply(router, [routeMeta.path, routeHandler]);
            }
            this.app.use(path, router);
        }
        console.table(tableRoutes, ['Path', 'Method', 'Handler']);
    }

    private async extractParameters(req: Request, res: Response, next: NextFunction, params: ParamMeta[] = []): Promise<any[]> {
        this.appContext.executionContext = new ExecutionContext(req, res, next);
        
        let args: any[] = [];
        for (const {paramType, name, index, type} of params) {
            switch (paramType) {
                case 'context':
                    args[index] = this.appContext;
                    break;
                case 'request':
                    args[index] = this.appContext.request;
                    break;
                case 'next':
                    args[index] = this.appContext.next;
                    break;
                case 'query':
                    args[index] = this.appContext.query(name);
                    break;
                case 'body':
                    args[index] = this.appContext.body(type, name);
                    break;
                case 'cookie':
                    args[index] = this.appContext.cookies(name);
                    break;
                case 'header':
                    args[index] = this.appContext.header(name);
                    break;
                case 'param':
                    args[index] = this.appContext.params(name);
                    break;
                case 'response':
                    args[index] = this.appContext.response;
                    break;
            }
        }
        return args;
    }

    async listen() {
        return new Promise<void>((resolve) => {
            if (this.secure) {
                https.createServer(this.serverOptions, this.app)
                    .listen(this.port, () => {
                        console.log(`${this.name} is listening on port ${this.port}`);
                        resolve();
                    });
            } else {
                http.createServer(this.serverOptions, this.app)
                    .listen(this.port, () => {
                        console.log(`${this.name} is listening on port ${this.port}`)
                        resolve();
                    });
            }
        })
    }
}
