import {Endpoint, Get, Post, Query, Context, Body} from '../../infra/service/Endpoint';
import {BadRequestResponse, RedirectResponse} from '../../infra/service/common-responses';
import crypto from 'crypto'
import {AppContext} from "../../infra/service/AppContext";
import {
    SDKVersionResponse, 
    SiteConfig,
    SiteConfigResponse,
    UserSite,
    UserSiteResponse
} from "./models";
import {GigyaClient} from "./GigyaClient";
import {
    IGetOPSResponse,
    IGetRPSResponse,
    IGetScreenSetResponse,
    IGetUserSitesResponse,
    IAdminSearchResponse,
    IGetSiteConfigResponse, 
    IGetPartnerResponse, 
    IGetIdPsResponse, 
    IGetSPsResponse
} from "./gigya-response";


@Endpoint('/admin')
export class GigyaAdminController {
    @Get('/user-sites')
    public async getUserSites(@Context() ctx: AppContext) {
        const response = await GigyaClient.getClient(ctx)
            .endpoint('admin.getUserSites')
            .send<IGetUserSitesResponse>();

        if (response.errorCode === 0) {
            const sites = response.sites.reduce((sites: UserSite[], partner): UserSite[] => {
                return [
                    ...sites,
                    ...partner.sites.map((site) => {
                        return {
                            tenantId: partner.tenantID,
                            partnerId: partner.partnerID,
                            siteId: site.siteID,
                            apiKey: site.apiKey,
                            baseDomain: site.baseDomain,
                            dc: site.dataCenter
                        } as UserSite;
                    })
                ];
            }, [])
            return new UserSiteResponse(sites)
        }
        return new BadRequestResponse(response.errorMessage, response);
    }

    @Get('/site-config')
    public async getSiteConfig(@Context() ctx: AppContext, @Query('apiKey') apiKey: string) {
        ctx.apiKey = apiKey;
        const [siteConfig, samlData, oidcData] = await Promise.all([
            this.getGigyaSiteConfig(ctx),
            this.getSamlData(ctx),
            this.getOidcData(ctx)
        ]);

        return new SiteConfigResponse({
            ...siteConfig,
            ...samlData,
            ...oidcData
        });
    }

    @Get('/sdk-versions')
    public async getSdkVersion(@Context() ctx: AppContext) {
        let response = await GigyaClient.getClient(ctx)
            .endpoint('js/ver.json')
            .sendAnonymous<any>()

        return new SDKVersionResponse(response.supportedVersions[`${ctx.dc}-${ctx.env}`]);
    }

    @Post('/sign') 
    public async signConsent(@Context() ctx: AppContext, @Body() consentObj: any) {
        consentObj.scope = consentObj.scope.replace(/\+/g, ' ');

        const consentObjStr = JSON.stringify(consentObj);
        const partnerSecret = await this.getPartnerSecret(ctx);
        const secret = Buffer.from(partnerSecret, 'base64');
        const signature = crypto
            .createHmac('sha1', secret)
            .update(consentObjStr, 'utf-8')
            .digest('base64')
            .replace(/=+$/, '')
            .replace(/\+/g, '-')
            .replace(/\//g, '_');

        return new RedirectResponse(`/oidc/proxy?mode=afterConsent&consent=${consentObjStr}&sig=${signature}`);
    }
 
    private async getPartnerSecret(ctx: AppContext) {
        let searchResponse = await GigyaClient.getClient(ctx)
            .endpoint('admin.search')
            .send<IAdminSearchResponse>({
                query: `select partnerID from sites where apiKey="${ctx.apiKey}"`
            });

        if (searchResponse.errorCode !== 0 || !searchResponse.data[0].partnerID) {
            throw 'Unable to get partner ID - ' + searchResponse.errorMessage;
        }

        let getPartnerResponse = await GigyaClient.getClient(ctx)
            .endpoint('admin.getPartner')
            .send<IGetPartnerResponse>({
                partnerID: searchResponse.data[0].partnerID
            });

        return getPartnerResponse.secretKey;
    }

    private async getSiteConfigData(ctx: AppContext) {
        const response = await GigyaClient.getClient(ctx)
            .endpoint('admin.getSiteConfig')
            .send<IGetSiteConfigResponse>({
                includeSiteID: true,
                includeGigyaSettings: true,
                includeSiteGroupConfig: true,
                apiKey: ctx.apiKey
            });

        if (response.errorCode !== 0) {
            console.error(response);
            throw 'Error retrieving data from Gigya - ' + response.errorMessage;
        }

        return response;
    }
    
    private async getScreenSetIdsFromGigya(ctx: AppContext) {
        let response = await GigyaClient.getClient(ctx)
            .endpoint('accounts.getScreenSets')
            .sendAnonymous<IGetScreenSetResponse>({ apiKey: ctx.apiKey});
        
        if (response.errorCode !== 0) {
            console.error(response);
            throw 'Error retrieving data from Gigya'
        }
        return new Set(response.screenSets.map(x => x.screenSetID.split('-')[0]));
    }

    private async getGigyaSiteConfig(ctx: AppContext): Promise<Partial<SiteConfig>> {
        const siteConfig = await this.getSiteConfigData(ctx);
        const screenSetIds = await this.getScreenSetIdsFromGigya(ctx);
        const ssoEnabled = siteConfig?.siteGroupConfig?.enableSSO
        return {
            siteId: siteConfig?.siteID,
            apiKey: ctx.apiKey,
            baseDomain: siteConfig?.baseDomain,
            dc: siteConfig?.dataCenter,
            customApiPrefix: siteConfig?.customAPIDomainPrefix || null,
            screenSetIds: [...screenSetIds],
            sso: {
                enabled: ssoEnabled,
                isGroupOwner: ssoEnabled && !siteConfig?.siteGroupOwner,
                members: ssoEnabled && (siteConfig?.siteGroupConfig.members ?? []) || []
            }
        };
    }

    private async getSamlData(ctx: AppContext): Promise<Partial<SiteConfig>> {
        const idPsResponse = await GigyaClient.getClient(ctx)
            .endpoint('fidm.saml.getRegisteredIdPs')
            .send<IGetIdPsResponse>({ apiKey: ctx.apiKey });
       
        if (idPsResponse.errorCode !== 0) {
            console.error(idPsResponse);
            throw 'Error retrieving data from Gigya - ' + idPsResponse.errorMessage; 
        }

        const spsResponse = await GigyaClient.getClient(ctx)
            .endpoint('fidm.saml.idp.getRegisteredSPs')
            .send<IGetSPsResponse>({ apiKey: ctx.apiKey });

        if (spsResponse.errorCode !== 0) {
            console.error(idPsResponse);
            throw 'Error retrieving data from Gigya - ' + spsResponse.errorMessage;
        }

        const hasSamlConfig = !!(idPsResponse.configs.length || spsResponse.configs.length);

        return {
            saml: {
                enabled: hasSamlConfig,
                isIDP: !!spsResponse.configs?.length,
                registeredIdPs: idPsResponse.configs?.map((x: any) => x.name) || []
            }
        };
    }

    private async getOidcData(ctx: AppContext): Promise<Partial<SiteConfig>> {
        let opsResponse = await GigyaClient.getClient(ctx)
            .endpoint('fidm.oidc.rp.getOPs')
            .send<IGetOPSResponse>( { apiKey: ctx.apiKey });

        if (opsResponse.errorCode !== 0) {
            console.error(opsResponse);
            throw 'Error retrieving data from Gigya ' + opsResponse.errorMessage;
        }

        let rpsResponse = await GigyaClient.getClient(ctx)
            .endpoint('fidm.oidc.op.getRPs')
            .send<IGetRPSResponse>( { apiKey: ctx.apiKey });

        if (rpsResponse.errorCode !== 0) {
            console.error(rpsResponse);
            throw 'Error retrieving data from Gigya - ' + rpsResponse.errorMessage 
        }
        const hasOidcConfig = !!(opsResponse.OPs.length || rpsResponse.RPs.length);
        return {
            oidc: {
                enabled: hasOidcConfig,
                isOp: !!rpsResponse.RPs?.length,
                registeredOPs: opsResponse.OPs?.map((x: any) => x.providerName) || []
            }
        }
    }
}
