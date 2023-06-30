<script lang="ts">
    import {onMount, tick} from 'svelte';
    import {getGigyaDomain} from '../utils/consts';
    import {siteSettings} from '../stores/site-settings';
    import type {SiteSettings} from '../stores/site-settings';
    import {toastStore} from '../stores/toasts/store';
    import {showSuccessToast} from '../stores/toasts/actions';
    import {gigState, gigStore, gigyaServiceReady} from '../stores/gigya';

    const gigyaReadyEvent = 'gigya-ready';
    let src;

    function onGigyaServiceReady() {
        toastStore.dispatch(showSuccessToast({message: 'Gigya loaded!!'}));
        gigStore.dispatch(gigyaServiceReady())
    }

    async function reloadGigyaScript(site: SiteSettings, reload: boolean) {
        if (!reload || !site.dc || !site.env || !site.apiKey) return;
        src = null;
        window.gigya = undefined;
        await tick();
        src = `https://cdns.${getGigyaDomain(site.dc, site.env)}/js/gigya.js?apikey=${site.apiKey}&version=${site.version}&dbg=1`;
    }

    onMount(() => {
       document.addEventListener(gigyaReadyEvent, onGigyaServiceReady);
        return () => {
            document.removeEventListener(gigyaReadyEvent, onGigyaServiceReady);
        }
    });

    $: reloadGigyaScript($siteSettings, $gigState.reload)
</script>

<svelte:head>
    {#if src}
        <script {src} />
    {/if}
    <script type="text/javascript">
        var onGigyaServiceReady = function () {
            const event = new CustomEvent('gigya-ready');
            document.dispatchEvent(event);
        }
    </script>
</svelte:head>