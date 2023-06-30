<script lang="ts">
    import {getContext, onMount} from 'svelte';

    export let label: string;
    export let icon: string;

    let active = false;
    let el: HTMLDivElement;
    let index = 0;

    const tabConfig = getContext('tabs');

    function updateIndex() {
        if(el && el.parentNode) {
            index = Array.prototype.indexOf.call(el.parentNode.children, el)
        }
    }

    onMount(() => {
        updateIndex();

        tabConfig.tabs.update(tabs => [
            ...tabs,
            {
                label,
                icon,
                activate: () => (active = true),
                deactivate: () => (active = false)
            }
        ])
    });
</script>

<style lang="scss">
    .tab {
      display: none;
      &.is-active {
        display: block;
      }
    }
</style>


<div class="tab" class:is-active={active} bind:this={el}>
    <slot />
</div>
