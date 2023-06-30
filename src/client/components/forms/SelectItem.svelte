<script lang="ts">
    import {getContext, onMount, onDestroy} from 'svelte';

    export let value: string | number;
    const {selectedValue, addItem, removeItem} = getContext('select');

    onMount(() => {
        addItem(value);
    });

    onDestroy(() => {
        removeItem(value);
    })

    function selectItem() {
        selectedValue.set(value);
    }
</script>

<a href class="dropdown-item" class:is-active={$selectedValue === value} on:click|preventDefault={selectItem}>
    <slot />
</a>