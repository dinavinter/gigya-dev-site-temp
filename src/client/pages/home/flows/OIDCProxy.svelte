<script lang="ts">
    import PageHeader from "../../../components/common/PageHeader.svelte";
    import {getGigyaDomain} from '../../../utils/consts';
    import {siteSettings} from '../../../stores/site-settings';
    import {isGigyaServiceReady} from "../../../stores/gigya";

    let src;
    function getOidcJs(site) {
        if (!site || !site.apiKey) return null;
        return `https://cdns.${getGigyaDomain(site.dc, site.env)}/js/gigya.oidc.js?apiKey=${site.apiKey}&dbg=1`;
    }

    $: src = getOidcJs($siteSettings)
</script>

<svelte:head>
    {#if src && $isGigyaServiceReady}
    <script {src}>
        {
            loginURL: `https://${window.location.hostname}/login`,
            consentURL: `https://${window.location.hostname}/oidc/consent`,
            errorURL: `https://${window.location.hostname}/oidc/error`
        }
    </script>
    {/if}
</svelte:head>

<PageHeader title="OIDC Proxy"/>
