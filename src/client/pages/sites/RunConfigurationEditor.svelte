<script lang="ts">
    import Box from "../../components/common/Box.svelte";
    import Icon from "../../components/common/Icon.svelte";
    import {mdiContentSave, mdiPlus, mdiTrashCanOutline, mdiWebCancel} from "@mdi/js";
    import type {RunConfiguration} from '../../stores/sites';
    import ConfigurationTags from "./ConfigurationTags.svelte";
    import TagsInput from "../../components/common/TagsInput.svelte";
    import Button from "../../components/forms/Button.svelte";
    import {BulmaColor} from "../../utils/types";
    import SidePanel from "../../components/common/SidePanel.svelte";
    import {siteStore, saveRunConfiguration, deleteRunConfiguration} from "../../stores/sites";
    import type {SiteRunConfiguration} from "../../stores/sites";
    import TagList from "../../components/tags/TagList.svelte";
    import Tag from "../../components/tags/Tag.svelte";
    import SiteSelector from "./SiteSelector.svelte";
    import {findIndex} from 'lodash';
    import SectionHeader from "../../components/common/SectionHeader.svelte";

    export let configuration: RunConfiguration;
    let sidePanel: SidePanel;
    let siteSelector: SiteSelector;
    let sites = [];
    let siteConfig: SiteRunConfiguration;


    function onPanelClose() {
        siteConfig = null;
        siteSelector.reset();
    }


    function addSiteConfiguration() {
        const index = findIndex(configuration.sites, s => s.apiKey === siteConfig.apiKey)
        if (index < 0) {
            configuration.sites.push(siteConfig);
        } else {
            configuration.sites[index] = siteConfig;
        }
        updateSiteConfiguration();
        sidePanel.close();
    }

    function updateSiteConfiguration() {
        siteStore.dispatch(saveRunConfiguration(configuration));
    }

    function removeSiteConfiguration() {
        siteStore.dispatch(deleteRunConfiguration(configuration));
    }

    function removeSite(site: SiteRunConfiguration) {
        configuration.sites = configuration.sites.filter(s => s.siteId !== site.siteId);
        updateSiteConfiguration();
    }

    function editSite(s: SiteRunConfiguration) {
        siteConfig = s;
        sidePanel.open();
    }
</script>
<div class="tile is-vertical {$$props.class || ''}">
    <Box class="tile is-flex is-flex-direction-column mb-3{configuration ? ' is-flex-basis-auto is-flex-grow-0' : ''}">
        {#if !configuration}
            <div class="mt-7 is-flex is-align-items-center is-justify-content-center">
                <section class="has-text-grey-light has-text-centered">
                    <p>
                        <Icon path={mdiWebCancel} size="4"/>
                    </p>
                    <p class="is-size-5">You need to select configuration,<br/>or create a new one</p>
                </section>
            </div>
        {:else}
            <SectionHeader title={configuration.id}>
                <svelte:fragment slot="buttons">
                    <Button title="Delete" icon={mdiTrashCanOutline} on:click={removeSiteConfiguration}  />
                    <Button title="Save" icon={mdiContentSave} color={BulmaColor.Link} on:click={updateSiteConfiguration}  />
                </svelte:fragment>
            </SectionHeader>
            <ConfigurationTags config={configuration} show="site"/>
            <ConfigurationTags config={configuration} show="run"/>
            <TagsInput label="Tags" bind:tags={configuration.tags} />
        {/if}
    </Box>
    {#if configuration}
        <Box class="tile is-child is-flex is-flex-direction-column {$$props.class || ''}">
            <SectionHeader title="Sites ({configuration.sites.length})">
                <Button slot="buttons" icon={mdiPlus} title="Add Site" color={BulmaColor.Link} on:click={sidePanel.open}  />
            </SectionHeader>
            <ul class="site-list is-flex-grow-1">
                {#each configuration.sites as site (site.siteId)}
                    <li class="site-list-item">
                        <a class="is-flex is-justify-content-space-between is-align-items-center" href on:click|preventDefault={() => editSite(site)}>
                            <div>
                            <div class="title is-size-5">{site.baseDomain}</div>
                            <div class="subtitle has-text-success-dark is-size-7 mb-3">{site.apiKey}</div>
                            <TagList>
                                {#if site.sso}
                                    <Tag label="SSO" color={BulmaColor.Danger} addon={site.sso} isLight={true} />
                                {/if}
                                {#if site.saml}
                                    <Tag label="SAML" color={BulmaColor.Success} addon={site.saml} isLight={true} />
                                {/if}
                                {#if site.oidc}
                                    <Tag label="OIDC" color={BulmaColor.Warning} addon={site.oidc} isLight={true} />
                                {/if}
                            </TagList>
                            </div>
                            <span class="actions">
                                <Button class="has-text-danger-dark" color={BulmaColor.White} icon={mdiTrashCanOutline} on:click={() => removeSite(site)} />
                            </span>
                        </a>
                    </li>
                {/each}
            </ul>
    </Box>
{/if}
</div>

<SidePanel bind:this={sidePanel} on:close={onPanelClose} title="Update Site">
    <svelte:fragment slot="content">
        <SiteSelector bind:this={siteSelector} bind:siteConfig={siteConfig} />
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <Button class="footer-button" title="Cancel" on:click={sidePanel.close} />
        <Button class="footer-button" title="Save" color={BulmaColor.Link} on:click={addSiteConfiguration} disabled={!siteConfig}  />
    </svelte:fragment>
</SidePanel>

<style lang="scss">
  @import "src/client/mixin";
  @import "src/client/variables";
  @import "bulma/sass/utilities/derived-variables";
  .mt-7 {
    margin-top: 7rem;
  }

  .divider {
    height: 1px;
    background-color: #ddd;
    margin: 8px 0 16px 0;
  }

  .site-list {
    @include scroll-bar();
    .site-list-item {
      padding: 12px 16px;
      &:not(:last-child) {
        border-bottom: $item-border;
      }
      a {
        color: $dark;
      }

      &:hover {
        background-color: #eee;
      }
    }
  }
</style>

