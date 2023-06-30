<script lang="ts">
    import TextInput from "../forms/TextInput.svelte";
    import TagLists from "../tags/TagList.svelte";
    import Tag from "../tags/Tag.svelte";
    import {BulmaColor} from "../../utils/types";
    import {mdiFilter} from "@mdi/js";
    import {createEventDispatcher} from 'svelte';

    let filters: string[] = [];
    let filter: string;
    const dispatch = createEventDispatcher();

    function handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter':
                addFilter()
                break;
        }
    }

    function addFilter() {
        filters = [...filters, filter];
        filter = '';
    }

    function handleFilterChange(){
        dispatch('filter', {
            filters: [...filters, filter]
        });
    }
</script>

<div class="px-4 pt-4 filter">
    <TextInput bind:value={filter} label="" placeholder="Filter" icon={mdiFilter} on:keydown={handleKeyDown} on:keyup={handleFilterChange} />
    <div class="tags">
        <TagLists class="mb-3">
            {#each filters as f}
                <Tag label={f} color={BulmaColor.Info} closeable={true} on:delete={(e) => {
                        filters = filters.filter(x => x !== e.detail.label);
                        dispatch('filter', { filters });
                    }} />
            {/each}
        </TagLists>
    </div>
</div>

<style lang="scss">
  @import "src/client/variables";
  .filter {
    border-bottom: $item-border;
  }
  .tags {
    min-height: 40px;
  }
</style>