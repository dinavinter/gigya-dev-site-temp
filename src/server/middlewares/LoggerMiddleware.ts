import {IMiddleware} from '../infra/service/Middleware';
import {AppContext} from '../infra/service/AppContext';
import morgan from 'morgan';
import {Injectable} from "../infra/DI";

@Injectable()
export class LoggerMiddleware implements IMiddleware {
    public use(ctx: AppContext): void {
        ctx.app.use(morgan('dev'));
    }
}