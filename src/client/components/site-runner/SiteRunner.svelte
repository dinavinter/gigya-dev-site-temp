<script lang="ts">
    import SidePanel from "../common/SidePanel.svelte";
    import Button from "../forms/Button.svelte";
    import {BulmaColor} from "../../utils/types";
    import {tick} from 'svelte';
    import SiteSelector from "../../pages/sites/SiteSelector.svelte";
    import type {SiteRunConfiguration} from "../../stores/sites";

    let sidePanel: SidePanel;
    let siteSelector: SiteSelector;
    let siteConfig: SiteRunConfiguration;

    function onPanelClose() {
        siteSelector.reset();
    }

    async function windowHandleKeyDown(event: KeyboardEvent) {
        if (event.altKey && event.key === 's') {
            await tick();
            sidePanel.open();
        } else if (event.key === 'Escape') {
            sidePanel.close();
        }
    }
</script>

<svelte:window on:keydown={windowHandleKeyDown} />
<SidePanel bind:this={sidePanel} on:close={onPanelClose} title="Run Site">
    <svelte:fragment slot="content">
        <SiteSelector bind:this={siteSelector} bind:siteConfig />
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <Button class="footer-button" title="Cancel" on:click={sidePanel.close} />
        <Button class="footer-button" title="Run" color={BulmaColor.Link}  />
    </svelte:fragment>
</SidePanel>
