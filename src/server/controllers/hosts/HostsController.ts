import crypto from "crypto";
import { HostsFile } from "../../infra/utils/hosts";
import {Context, Delete, Endpoint, Get, Post, Put} from "../../infra/service/Endpoint";
import {GetAllHostsResponse, HostItem} from "./models";
import { Database } from "../../infra/db/Database";
import { Collection } from "../../infra/db/Collection";
import {AppContext} from "../../infra/service/AppContext";
import {
    ConflictResponse,
    CreatedResponse,
    NotFoundResponse,
    SuccessResponse
} from "../../infra/service/common-responses";
import { resolveIp } from "../../infra/utils/domains";

@Endpoint('/hosts')
export class HostsController {
    private readonly collection: Collection<HostItem>;
    private hosts: HostsFile;

    constructor(hosts: HostsFile, db: Database) {
        this.hosts = hosts;
        this.collection = db.collection(HostItem);
    }

    @Get('/')
    public async getHosts() {
        const hosts = this.collection.find();
        return new GetAllHostsResponse(hosts);
    }

    @Put('/')
    public async updateHost(@Context() ctx: AppContext) {
        const data = ctx.body(HostItem);
        if (this.collection.update(data)) {
            await this.syncHostsFile();
            return new SuccessResponse();
        }
        return new NotFoundResponse();
    }

    @Post('/')
    public async createHost(@Context() ctx: AppContext) {
        const data = ctx.body(HostItem);
        data.id = crypto.randomUUID()
            .replace(/-/g, "");
        const sameHosts = this.collection.find(item => item.hosts === data.hosts);
        if (sameHosts.length) {
            return new ConflictResponse();
        }
        this.collection.insert(data);
        await this.syncHostsFile();
        return new CreatedResponse();
    }

    @Delete('/:id')
    public async deleteHost(@Context() ctx: AppContext) {
        const hostId = ctx.params('id') as string;
        const host = this.collection.findById(hostId);
        if (!host) {
            return new NotFoundResponse();
        }
        this.collection.delete(host);
        await this.syncHostsFile();
        return new SuccessResponse();
    }

    @Post('/sync')
    public async syncHostsFile() {
        this.hosts.startSection('global-hosts')
            .clearSection();

        const hosts = this.collection.find();

        for (const h of hosts) {
            const target = await HostsController.resolveIp(h.target)
            if (h.active) {
                this.hosts.addItem(target, h.hosts, h.comment);
            }
        }
        this.hosts.endSection().flush();
        return new SuccessResponse();
    }

    private static async resolveIp(host: string): Promise<string> {
        if (host === 'localhost') {
            return '127.0.0.1';
        }
        const isIp = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/g
        if (isIp.test(host)) {
            return host;
        }
        return (await resolveIp(host)) ?? host;
    }
}