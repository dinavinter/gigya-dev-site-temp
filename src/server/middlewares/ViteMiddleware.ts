import {IMiddleware} from '../infra/service/Middleware';
import {AppContext} from '../infra/service/AppContext';
import {createServer} from 'vite';
import {svelte} from '@sveltejs/vite-plugin-svelte';
import preprocess from 'svelte-preprocess';
import {serverOptions} from '../services/HttpsService';
import {Injectable} from "../infra/DI";

@Injectable()
export class ViteMiddleware implements IMiddleware{
    public async use(ctx: AppContext): Promise<void> {
        const vite = await createServer({
            configFile: false,
            appType: 'spa',
            server: {
                middlewareMode: true,
                https: serverOptions
            },
            plugins: [svelte({
                preprocess: preprocess()
            })],
            root: 'src/client',
            optimizeDeps: { exclude: ['svelte-navigator'] },
        });
        ctx.app.use(vite.middlewares);
    }
}