import {IMiddleware} from '../infra/service/Middleware';
import {AppContext} from '../infra/service/AppContext';
import express from 'express';
import {Injectable} from "../infra/DI";

@Injectable()
export class StaticFileMiddleware implements IMiddleware {
    public use(ctx: AppContext): void {
        ctx.app.use(express.static('dist/client'));
    }
}