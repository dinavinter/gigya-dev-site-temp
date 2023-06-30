import { Database } from "../../infra/db/Database";
import { Memcached } from "../../infra/db/Memcached";
import { HostsFile } from "../../infra/utils/hosts";
import { Collection } from "../../infra/db/Collection";
import {Context, Delete, Endpoint, Get, Post, Put, Query} from "../../infra/service/Endpoint";
import { SiteConfigController } from "../site-config/SiteConfigController";
import { SiteRun, SiteRunsResponse } from "./models";
import {
    CreatedResponse,
    NotFoundResponse,
    RedirectResponse,
    SuccessResponse
} from "../../infra/service/common-responses";
import { AppContext } from "../../infra/service/AppContext";

@Endpoint('/site-run')
export class SiteRunController {
    private readonly siteRuns: Collection<SiteRun>;

    constructor(private db: Database, private hosts: HostsFile, private conf: SiteConfigController, private memcached: Memcached) {
        this.siteRuns = db.collection(SiteRun);
    }

    @Get('/select')
    public async runSite(@Query('apiKey') apiKey: string, @Query('runId') runId: string) {
        const siteRun = this.siteRuns.findById(runId)
        if (!siteRun) {
            return new NotFoundResponse();
        }
        this.updateHostFile(siteRun);
        
        const site = siteRun.sites.filter(s => s.apiKey === apiKey)[0];
        const conf = this.conf.internalGetConfig();
        conf.site = site;
        conf.runId = runId;
        this.conf.internalSetConfig(conf);
        this.memcached.revoke()
        return new RedirectResponse(`https://${site.baseDomain}`);
    }

    @Get()
    public async getRunConfigurations(@Context() ctx: AppContext) {
        return new SiteRunsResponse(
            this.siteRuns.find(item => item.dc === ctx.dc)
        );
    }

    @Post()
    public async createRunConfiguration(@Context() ctx: AppContext) {
        const data = ctx.body(SiteRun);
        data.dc = ctx.dc;
        this.siteRuns.insert(data);
        return new CreatedResponse();
    }

    @Put()
    public async updateRunConfiguration(@Context() ctx: AppContext) {
        const data = ctx.body(SiteRun);
        this.siteRuns.update(data);
        return new CreatedResponse();
    }

    @Delete('/:id')
    public async deleteCredential(@Context() ctx: AppContext) {
        const id = ctx.params('id') as string;
        const siteRun = this.siteRuns.findById(id);
        if (!siteRun) {
            return new NotFoundResponse();
        }
        this.siteRuns.delete(siteRun);
        return new SuccessResponse();
    }
    
    public getRunConfiguration(runId: string): SiteRun {
        return this.siteRuns.findById(runId);
    }
    
    private updateHostFile(siteRun: SiteRun) {
        this.hosts
            .startSection('site-run')
            .clearSection();
        for (const s of siteRun.sites) {
            this.hosts.addItem('127.0.0.1', s.baseDomain);
            if (s.cname) {
                this.hosts.addItem('127.0.0.1', s.cname);
            }
        }
        this.hosts
            .endSection()
            .flush();
    }
}
