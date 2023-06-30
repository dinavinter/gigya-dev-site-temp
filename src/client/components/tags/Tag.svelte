<script lang="ts">
    import {BulmaColor} from '../../utils/types';
    import {createEventDispatcher} from 'svelte';

    export let label: string;
    export let color: BulmaColor = BulmaColor.Light;
    export let addon: string = null;
    export let addonColor: BulmaColor = color === BulmaColor.Light ? BulmaColor.Dark : BulmaColor.Light;
    export let closeable = false;
    export let isLight = false;

    let dispatch = createEventDispatcher();

    function onDeleteClicked() {
        dispatch('delete', { label });
    }
</script>
<div class="control">
{#if addon}
    <div class="tags has-addons">
        <span class="tag{color ? ` is-${color}` : ''} is-rounded" class:is-light={isLight}>{label}</span>
        <span class="tag{addonColor ? ` is-${addonColor}` : ''} is-rounded" class:is-light={isLight}>{addon}</span>
    </div>
{:else if closeable}
    <div class="tags has-addons">
        <span class="tag{color ? ` is-${color}` : ''} is-rounded" class:is-light={isLight}>{label}</span>
        <a href on:click|preventDefault={onDeleteClicked} class="tag is-delete is-rounded">&nbsp;</a>
    </div>
{:else }
    <span class="tag{color ? ` is-${color}` : ''} is-rounded" class:is-light={isLight}>{label}</span>
{/if}
</div>
