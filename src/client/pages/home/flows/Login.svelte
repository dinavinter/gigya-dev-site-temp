<script lang="ts">
    import PageHeader from "../../../components/common/PageHeader.svelte";
    import PageContent from "../../../components/common/PageContent.svelte";
    import ScreenSetView from "../../screen-sets/ScreenSetView.svelte";
    import Box from "../../../components/common/Box.svelte";
    import {events, isGigyaServiceReady} from '../../../stores/gigya';
    import {navigate} from 'svelte-navigator';
    import FlowSkeleton from "../../../components/common/skeletons/FlowSkeleton.svelte";
    import {getUrlParams} from '../../../utils/url';
    import {siteSettings} from '../../../stores/site-settings';

    let params;

    function redirectOnLogin(event) {
        if (event?.type === 'login') {
            if (isSsoContext()) {
                window.gigya.sso.continue();
            } else if (isSamlContext()) {
                window.gigya.fidm.saml.continueSSO();
            } else if (isOidcContext()) {
                window.location.href = window.gigya.utils.URL.addParamsToURL(`https://${window.location.hostname}/oidc/proxy`, {
                    mode: 'afterLogin'
                });
            } else {
                navigate('/update-profile');
            }
        }
    }

    function isSsoContext() {
        const urlParams = getUrlParams();
        return window.gigya.partnerSettings.ssoKey && urlParams.has('gig_ssoToken');
    }

    function isSamlContext() {
        const urlParams = getUrlParams();
        return urlParams.has('samlContext');
    }

    function isOidcContext() {
        const cache = sessionStorage.getItem('gigyaCache');
        if (cache) {
            const cacheObj = JSON.parse(cache);
            return !!cacheObj[`gig_oidcContext_${window.gigya.apiKey}`];
        }
        return false;
    }

    function rebuildScreenSetParams(siteSettings) {
        if (!siteSettings.apiKey) return;
        params = {
            screenSet: `${siteSettings.defaultScreenSetId}-RegistrationLogin`,
            mode: 'inline',
            customButtons: [
                ...siteSettings.samlProviders.map((provider, i) => {
                    return {
                        type: 'saml',
                        provider: `saml-${provider}`,
                        providerName: provider,
                        idpName: provider,
                        iconURL: '/saml.png',
                        lastLoginIconURL: '/saml.png',
                        position: i + 1
                    }
                }),
                ...siteSettings.oidcProviders.map((provider, i) => {
                    return {
                        type: 'oidc',
                        providerName: `oidc-${provider}`,
                        opName: provider,
                        iconURL: '/oidc.png',
                        lastLoginIconURL: '/oidc.png',
                        position: siteSettings.samlProviders.length + (i + 1)
                    }
                }),
            ]
        }
    }

    $: redirectOnLogin($events)
    $: rebuildScreenSetParams($siteSettings)
</script>

<PageHeader title="Login & Register"/>
<PageContent class="tile is-ancestor">
    {#if $isGigyaServiceReady}
        <Box class="is-flex is-justify-content-center tile">
            <ScreenSetView {params} />
        </Box>
    {:else}
        <FlowSkeleton />
    {/if}
</PageContent>
