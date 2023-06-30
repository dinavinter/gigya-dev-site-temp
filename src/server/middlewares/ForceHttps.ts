import {IMiddleware} from '../infra/service/Middleware';
import {AppContext} from '../infra/service/AppContext';
import {Injectable} from "../infra/DI";

@Injectable()
export class ForceHttpsMiddleware implements IMiddleware{
    public use(ctx: AppContext): void {
        ctx.app.use((req, res, next) => {
            if (!req.secure) {
                return res.redirect("https://" + req.headers.host + req.url);
            }
            next();
        });
    }
}