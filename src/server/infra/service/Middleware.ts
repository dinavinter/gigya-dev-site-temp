import {AppContext} from './AppContext';

export interface IMiddleware {
    use(ctx: AppContext): void;
}