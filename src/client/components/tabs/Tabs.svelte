<script lang="ts">
    import {writable} from 'svelte/store';
    import Icon from "../common/Icon.svelte";
    import {onMount, setContext} from 'svelte';
    import {findIndex} from 'lodash';

    export let position = '';
    export let size = '';
    export let style = '';
    export let active = 0;

    let lastActive = active;
    let mounted = false;

    const tabs = writable([]);
    const tabConfig = {
        tabs,
        active
    }
    setContext('tabs', tabConfig);

    onMount(() => {
        mounted = true;
        const hash = location.hash.substring(1);
        const params = hash.split('&').reduce((previousValue, i) => {
            const keyValue = i.split('=');
            previousValue[keyValue[0]] = keyValue[1];
            return previousValue;
        }, {})
        const hashPos = findIndex($tabs, (item) => item.label.toLowerCase() === params['tab'])
        if (hashPos >= 0) {
            active = hashPos;
        }
    });

    function updateActiveTab() {
        if (!mounted) return;
        $tabs[lastActive]?.deactivate();
        $tabs[active]?.activate();
        location.hash = `tab=${$tabs[active].label.toLowerCase()}`;
        lastActive = tabConfig.active = active;
    }

    $: active, mounted, updateActiveTab()
</script>
<div class="is-flex is-flex-direction-column is-justify-content-space-evenly is-flex-grow-1">
    <div class="tabs {position} {size} {style} is-flex-grow-0">
        <ul>
            {#each $tabs as tab, index}
                <li class:is-active={index === active}>
                    <a href on:click|preventDefault={() => active = index}>
                        {#if tab.icon}
                            <Icon path={tab.icon} class="mr-2" size={0.8} />
                        {/if}
                        <span>{tab.label}</span>
                    </a>
                </li>
            {/each}
        </ul>
    </div>
    <section class="tab-content is-flex-grow-1">
        <slot />
    </section>
</div>

<style lang="scss">
    @import "src/client/mixin";
    .tabs {
      overflow: initial;
    }
    .tab-content {
      @include scroll-bar();
    }
</style>
