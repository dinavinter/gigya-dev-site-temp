<script lang="ts">
    import PageHeader from "../../../components/common/PageHeader.svelte";
    import PageContent from "../../../components/common/PageContent.svelte";
    import {events, isGigyaServiceReady} from "../../../stores/gigya";
    import FlowSkeleton from "../../../components/common/skeletons/FlowSkeleton.svelte";
    import Box from "../../../components/common/Box.svelte";
    import ScreenSetView from "../../screen-sets/ScreenSetView.svelte";
    import {siteSettings} from '../../../stores/site-settings';
    import {navigate} from 'svelte-navigator';

    export let title: string;
    export let screenSetId: 'LinkAccount' | 'LiteRegistration' | 'PasswordlessLogin' | 'ProfileUpdate' | 'ReAuthentication' | 'RegistrationLogin';
    export let startScreen: string = null;
    export let requireSession: boolean = false;

    let params;

    function redirectOnLogout(event) {
        if (event?.type === 'logout') {
            navigate('/login');
        }
    }

    function rebuildScreenSetParams(siteSettings) {
        if (!siteSettings.apiKey) return;
        params = {
            screenSet: `${siteSettings.defaultScreenSetId}-${screenSetId}`,
            startScreen,
            mode: 'inline',
        }
    }

    $: rebuildScreenSetParams($siteSettings);
    $: requireSession && redirectOnLogout($events);
</script>

<PageHeader title="{title}"/>
<PageContent class="tile is-ancestor">
    {#if $isGigyaServiceReady}
        <Box class="is-flex is-justify-content-center tile">
            <ScreenSetView {params} />
        </Box>
    {:else}
        <FlowSkeleton />
    {/if}
</PageContent>
