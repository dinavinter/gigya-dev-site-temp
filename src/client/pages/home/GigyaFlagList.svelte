<script lang="ts">
    import Switch from "../../components/forms/Switch.svelte";
    import TextInput from "../../components/forms/TextInput.svelte";
    import {mdiFilter} from "@mdi/js";
    import {onMount} from 'svelte';
    import {BulmaColor} from "../../utils/types";

    interface Flag {
        name: string;
        checked: boolean
    }

    let flags: Flag[] = [];
    let filterFlags: Flag[] = [];
    let filter = '';

    onMount(() => {
        filterFlags = flags = Object.entries(gigya._.config.flags).map(([key, value]) => {
            return {
                name: key,
                checked: value
            };
        })
    });

    $: filterFlags = flags.filter(x => x.name.indexOf(filter) >= 0)
</script>

<div class="is-flex is-flex-direction-column">
    <TextInput placeholder="Filter" icon={mdiFilter} bind:value={filter} />
    <ul class="m-0 is-flex-grow-1">
        {#each filterFlags as {name, checked} (name)}
            <li class="flag is-flex is-justify-content-space-between px-3 py-2 is-align-items-center">
                <span>{name}</span>
                <Switch {checked} disabled={true} color={BulmaColor.Info} />
            </li>
        {/each}
    </ul>
</div>

<style lang="scss">
  @import "src/client/mixin";
  @import "src/client/variables";
  ul {
    @include scroll-bar();
  }
  .flag {
    &:not(:last-child) {
      border-bottom: $item-border;
    }
  }
</style>