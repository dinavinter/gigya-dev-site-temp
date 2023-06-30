import {AppContext} from "../../infra/service/AppContext";
import axios, {Axios} from "axios";
import https from "https";
import {entries} from "lodash";
import {IGigyaResponse} from "./gigya-response";

export class GigyaClient {
    private readonly axios: Axios;
    private _endpoint: string;
    private _namespace: string;
    private constructor(private ctx: AppContext) {
        this.axios = axios.create({
            httpsAgent: new https.Agent({
                rejectUnauthorized: false
            })
        });
    }
    
    public static getClient(ctx: AppContext) {
        return new GigyaClient(ctx);
    }

    public endpoint(endpoint: string) {
        const endpointRegex = /^([A-Za-z.])+$/g
        this._endpoint = endpoint;
        this._namespace = endpointRegex.test(endpoint) ? endpoint.split('.')[0] : 'accounts';
        return this;
    }

    public async send<T extends IGigyaResponse>(params?: object): Promise<T> {
        const url = this.buildUrl();
        const queryParams = this.parseQueryParams({
            userKey: this.ctx.credential.userKey,
            secret: this.ctx.credential.secret,
            ...params
        });

        let res = await this.axios.get(url, queryParams);
        return res.data as T;
    }

    public async sendAnonymous<T extends IGigyaResponse>(params?: object): Promise<T> {
        const url = this.buildUrl();
        const queryParams = this.parseQueryParams({
            ...params
        });

        let res = await this.axios.get(url, queryParams);
        return res.data as T;
    }

    private parseQueryParams(param: object) {
        return {
            params: entries(param)
                .reduce((previousValue, [key, value]) => {
                    previousValue.set(key, value);
                    return previousValue;
                }, new URLSearchParams())
        }
    }

    private buildUrl() {
        let domain;
        const {dc, env} = this.ctx;
        if (dc === 'cn1') {
            domain = env === 'prod' ?
                `${dc}.sapcdm.cn` :
                `${dc}-${env}.${dc}.sapcdm.cn`
        } else {
            domain = `${dc}${env !== 'prod' ? `-${env}` : ''}.gigya.com`;
        }
        return `https://${this._namespace}.${domain}/${this._endpoint}`;
    }
}