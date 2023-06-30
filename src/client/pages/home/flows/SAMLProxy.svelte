<script lang="ts">
    import PageHeader from "../../../components/common/PageHeader.svelte";
    import {getGigyaDomain} from '../../../utils/consts';
    import {siteSettings} from '../../../stores/site-settings';

    let src;
    function getSamlJs(site) {
        if (!site || !site.apiKey) return null;
        return `https://cdns.${getGigyaDomain(site.dc, site.env)}/js/gigya.saml.js?apiKey=${site.apiKey}&dbg=1`;
    }

    $: src = getSamlJs($siteSettings)
</script>

<svelte:head>
    {#if src}
    <script {src}>
        {
            loginURL: `https://${window.location.hostname}/login`,
            logoutURL: `https://${window.location.hostname}/saml/logout`
        }
    </script>
    {/if}
</svelte:head>

<PageHeader title="SAML Proxy"/>