import {HttpService} from './services/HttpService';
import {HttpsService} from './services/HttpsService';
import {Injector} from './infra/DI';
import {Database} from './infra/db/Database';
import {HostItem} from "./controllers/hosts/models";
import {Credential} from "./controllers/credentials/models";
import {SiteRun} from "./controllers/site-run/models";

async function bootstrap() {
    const db = Injector.resolve<Database>(Database);
    await db.registerCollection(HostItem);
    await db.registerCollection(Credential);
    await db.registerCollection(SiteRun);

    await new HttpsService().listen();
    await new HttpService().listen();
}

bootstrap();

