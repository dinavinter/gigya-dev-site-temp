<script lang="ts">
    import Box from "../../components/common/Box.svelte";
    import {mdiSearchWeb} from "@mdi/js";
    import RunConfigurationItem from "./RunConfigurationItem.svelte";
    import Icon from "../../components/common/Icon.svelte";
    import {selectConfiguration, selectedConfiguration, siteConfigurations, siteStore} from "../../stores/sites";
    import type {RunConfiguration} from "../../stores/sites";
    import Fuse from 'fuse.js';
    import {createEventDispatcher, onMount} from 'svelte';
    import Filter from "../../components/common/Filter.svelte";

    let filteredConfiguration: RunConfiguration[];
    let fuse: Fuse;
    let filter = '';
    let filters: string[] = [];
    const dispatch = createEventDispatcher();
    const keys = ['id', 'tags'];


    function getFilteredSites(terms: string[], configurations: RunConfiguration[]): RunConfiguration[] {
        terms = terms.filter(st => !!st)
        const complexTerm = {
            $and: terms.map(st => {
                return {
                    $or: keys.reduce((list, key) => {
                        list.push({ [key]: st })
                        return list
                    },[])
                }
            })
        };
        return terms.length ? (fuse?.search(complexTerm) || []).map(x => x.item as RunConfiguration) : configurations;
    }

    onMount(() => {
        fuse = new Fuse<RunConfiguration>([], {
            threshold: 0.2,
            useExtendedSearch: true,
            keys
        });
    });

    function setSelectConfiguration(config: RunConfiguration) {
        siteStore.dispatch(selectConfiguration(config));
    }

    $: fuse?.setCollection($siteConfigurations);
    $: filteredConfiguration = getFilteredSites(filters, $siteConfigurations);
</script>
<Box class="tile p-0 is-flex is-flex-direction-column">
    <Filter on:filter={e => filters = e.detail.filters} />
    {#if filteredConfiguration?.length}
        <ul class="is-flex-grow-1">
            {#each filteredConfiguration as config (config.id)}
                <RunConfigurationItem {config} on:click={() => setSelectConfiguration(config)} isActive={$selectedConfiguration?.id === config.id}/>
            {/each}
        </ul>
    {:else}
        <section class="has-text-grey-light has-text-centered mt-6">
            <p><Icon path={mdiSearchWeb} size="4"/></p>
            <p class="is-size-6">No run configuration found</p>
        </section>
    {/if}
</Box>

<style lang="scss">
    @import "src/client/mixin";
    ul {
      @include scroll-bar();
    }
</style>