import {Column, Entity} from "../../infra/db/decorators";
import {isEnum, isString, Prop, required} from "../../infra/validation/Validation";
import {JsonProperty} from "../../infra/meta-data/response-meta";

@Entity('credentials')
export class Credential {
    @Prop(required, isString)
    @Column({ primary: true })
    public userKey: string;

    @Prop(required, isString)
    @Column()
    public secret: string;

    @Prop(required, isEnum(['us1', 'eu2', 'cn1', 'il3']))
    @Column()
    public dc: string;
}

export class GetAllCredentialsResponse {
    constructor(all: Credential[]) {
        this.credentials = all;
    }

    @JsonProperty()
    public credentials: Credential[];
}
