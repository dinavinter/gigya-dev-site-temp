import {IMiddleware} from '../infra/service/Middleware';
import {AppContext} from '../infra/service/AppContext';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import {Injectable} from "../infra/DI";

@Injectable()
export class BaseMiddleware implements IMiddleware {
    public use(ctx: AppContext): void {
        ctx.app.use(cookieParser());
        ctx.app.use(bodyParser.json());
        ctx.app.use(bodyParser.urlencoded({ extended: false }));
        ctx.app.use(cors({ origin: '*' }));
    }
}