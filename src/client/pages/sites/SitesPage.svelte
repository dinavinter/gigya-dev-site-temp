<script lang="ts">
    import RunConfigurationList from "./RunConfigurationList.svelte";
    import PageContent from "../../components/common/PageContent.svelte";
    import PageHeader from "../../components/common/PageHeader.svelte";
    import RunConfigurationEditor from "./RunConfigurationEditor.svelte";
    import SidePanel from "../../components/common/SidePanel.svelte";
    import Button from "../../components/forms/Button.svelte";
    import {BulmaColor} from "../../utils/types";
    import {mdiPlus} from "@mdi/js";
    import type {SiteRunConfiguration, RunConfiguration} from "../../stores/sites";
    import TextInput from "../../components/forms/TextInput.svelte";
    import {createRunConfiguration, selectedConfiguration, siteStore} from "../../stores/sites";
    import SiteSelector from "./SiteSelector.svelte";
    import Divider from "../../components/common/Divider.svelte";

    let newSidePanel: SidePanel;
    let sites = [];
    let currentConfiguration: RunConfiguration;
    let siteConfig: SiteRunConfiguration;
    let siteSelector: SiteSelector;
    let newConfiguration: RunConfiguration = {
        id: '',
        sites: [],
        tags: []
    };


    function onPanelClose() {
        newConfiguration = {
            id: '',
            sites: [],
            tags: []
        }
        siteConfig = null;
        siteSelector.reset();
    }

    function createNewConfiguration() {
        newConfiguration.sites = [siteConfig];
        siteStore.dispatch(createRunConfiguration(newConfiguration));
        currentConfiguration = newConfiguration;
        newSidePanel.close();
    }
</script>

<PageHeader title="Run Configurations">
    <svelte:fragment slot="actions">
        <div class="field is-grouped">
            <div class="buttons has-addons">
                <Button icon={mdiPlus} title="New"  color={BulmaColor.Link} on:click={newSidePanel.open}  />
            </div>
        </div>
    </svelte:fragment>
</PageHeader>
<PageContent class="tile is-ancestor">
    <div class="tile is-3 mr-3">
        <RunConfigurationList />
    </div>
    <div class="tile">
        <RunConfigurationEditor configuration={$selectedConfiguration} />
    </div>
</PageContent>

<SidePanel bind:this={newSidePanel} on:close={onPanelClose} title="Run Configuration">
    <svelte:fragment slot="content">
        <TextInput label="ID" bind:value={newConfiguration.id} />
        <div class="label">Site</div>
        <Divider />
        <SiteSelector bind:this={siteSelector} bind:siteConfig={siteConfig} />
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <Button class="footer-button" title="Cancel" on:click={newSidePanel.close} />
        <Button class="footer-button" title="Save" color={BulmaColor.Link} on:click={createNewConfiguration} disabled={!(newConfiguration.id && siteConfig)} />
    </svelte:fragment>
</SidePanel>
