import {Column, Entity} from "../../infra/db/decorators";
import {isArray, isString, isStringArray, Prop, required} from "../../infra/validation/Validation";
import {JsonProperty} from "../../infra/meta-data/response-meta";

export class SiteData {
    siteId: number;
    apiKey: string;
    baseDomain: string;
    dc: string;
    defaultScreenSetId: string;
    cname?: string;
    sso?: 'Parent' | 'Child';
    saml?: 'IdP' | 'SP';
    registeredIdPs?: string[]
    oidc?: 'OP' | 'RP';
    registeredOPs?: string[];
}


@Entity('run-config')
export class SiteRun {
    @Prop(required, isString)
    @Column({primary: true})
    id: string;

    @Column()
    dc: string;

    @Prop(isStringArray)
    @Column()
    tags: string[];

    @Prop(isArray)
    @Column()
    sites: SiteData[];
}

export class SiteRunsResponse {
    constructor(items: SiteRun[]) {
        this.siteRuns = items;
    }

    @JsonProperty('configurations')
    public siteRuns: SiteRun[];
}