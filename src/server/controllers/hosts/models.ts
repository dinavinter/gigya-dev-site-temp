import {Column, Entity} from "../../infra/db/decorators";
import {isBoolean, required} from "../../infra/validation/Validation";
import { isString } from "../../infra/validation/Validation";
import { Prop } from "../../infra/validation/Validation";
import {JsonProperty} from "../../infra/meta-data/response-meta";

@Entity('hosts')
export class HostItem {
    @Prop(isString)
    @Column({primary: true})
    public id: string;

    @Prop(required, isString)
    @Column()
    public hosts: string;

    @Prop(required, isString)
    @Column()
    public target: string;

    @Prop(isString)
    @Column()
    public comment: string;

    @Prop(isBoolean)
    @Column()
    public active: boolean;
}

export class GetAllHostsResponse {
    constructor(all: HostItem[]) {
        this.hosts = all;
    }

    @JsonProperty()
    public hosts: HostItem[];
}