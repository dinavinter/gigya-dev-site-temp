import {Context, Delete, Endpoint, Get, Post, Put} from '../../infra/service/Endpoint';
import {AppContext} from '../../infra/service/AppContext';
import {CreatedResponse, NotFoundResponse, SuccessResponse} from '../../infra/service/common-responses';
import {Database} from '../../infra/db/Database';
import {Collection} from '../../infra/db/Collection';
import {GetAllCredentialsResponse, Credential} from "./models";
@Endpoint('/credential')
export class CredentialController {
    private readonly collection: Collection<Credential>;
    constructor(db: Database) {
        this.collection = db.collection(Credential);
    }

    @Post()
    public async createCredential(@Context() ctx: AppContext) {
        const data = ctx.body(Credential);
        await this.collection.insert(data);
        return new CreatedResponse();
    }

    @Get()
    public async getAll(@Context() ctx: AppContext) {
        return new GetAllCredentialsResponse(this.collection.find());
    }

    @Put()
    public async updateCredential(@Context() ctx: AppContext) {
        const data = ctx.body(Credential);
        if (this.collection.update(data)) {
            return new SuccessResponse();
        }
        return new NotFoundResponse();
    }

    @Delete('/:id')
    public async deleteCredential(@Context() ctx: AppContext) {
        const userKey = ctx.params('id') as string;
        const creds = this.collection.findById( userKey);
        if (!creds) {
            return new NotFoundResponse();
        }
        this.collection.delete(creds);
        return new SuccessResponse();
    }
    
    public getCredentialByDC(dc: string) {
        return this.collection.find(c => c.dc === dc)[0] ?? null;
    }
}