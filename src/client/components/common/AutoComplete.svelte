<script lang="ts">
    import {uid} from '../../utils/unique-id-generator';
    import type Component from 'svelte/types/compiler/compile/Component';
    import Fuse from 'fuse.js';
    import {createEventDispatcher} from 'svelte';
    import Icon from "./Icon.svelte";
    import {mdiRefresh} from "@mdi/js";

    export let label: string;
    export let placeholder: string = '';
    export let icon: string = null;
    export let items: any[];
    export let view: Component = null;
    export let key = 'id';
    export let value: any = null;
    export let disabled = false;

    const dispatch = createEventDispatcher();
    const id = uid();
    let filteredItems = [];
    let fuse: Fuse;
    let selectedIndex = 0;
    let selectedItem = null

    export function clear() {
        selectedItem = null
        value = '';
    }

    function handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter':
                selectItem()
                break;
            case 'ArrowUp':
                if ((selectedIndex - 1) >= 0) {
                    selectedIndex--;
                    scrollToSelectedItem(selectedIndex);
                }
                break;
            case 'ArrowDown':
                if ((selectedIndex + 1) < filteredItems.length) {
                    selectedIndex++;
                    scrollToSelectedItem(selectedIndex);
                }
                break
            default:
                selectedIndex = 0;
                selectedItem = null;
                break
        }
    }

    function selectItem(index = selectedIndex) {
        selectedIndex = index;
        selectedItem = filteredItems[selectedIndex]?.item || { [key]: value };
        value = selectedItem && (selectedItem[key] || selectedItem);
        dispatch('select', value);
    }

    function scrollToSelectedItem(index: number) {
        const item = filteredItems[index].item
        const itemKey = item[key] || item;
        const elem = document.querySelector(`[data-item-key="${itemKey}"]`)
        elem.scrollIntoView({
            block: 'nearest'
        });
    }

    function updateList(term: string) {
        return (term && fuse?.search(term)) || [];
    }

    function refresh() {
        if (!value) return;
        dispatch('select', value);
    }

    $: filteredItems = updateList(value);
    $: fuse = new Fuse(items || [], {
        includeMatches: true,
        threshold: 0.2,
        keys: Object.getOwnPropertyNames(items && items[0] || {})
    });
    
</script>
<div class="field">
    <label class="label" for={id}>{label ?? ''}</label>
    <div class="control">
        <div class="dropdown{value?.length >= 1 && filteredItems?.length > 1 ? ' is-active' : ''}">
            <div class="dropdown-trigger">
                <div class="control has-icons-right" class:has-icons-left={!!icon}>
                    <input id={id} bind:value={value} type="text" class="input is-rounded" on:keydown={handleKeyDown} {disabled} {placeholder}>
                    {#if icon}
                        <span class="icon is-small is-left">
                            <Icon path={icon} />
                        </span>
                    {/if}
                    <a href class="refresh-button icon is-small is-right" on:click|preventDefault={refresh}>
                        <Icon path={mdiRefresh} />
                    </a>
                </div>

            </div>
            <div class="dropdown-menu">
                <div class="dropdown-content p-1">
                    {#each filteredItems as i, index (i[key] || i)}
                        <a href class="dropdown-item" data-item-key={i.item[key] || i.item}
                           class:is-active={selectedIndex === index}
                           on:click|preventDefault={() => selectItem(index)}>
                            {#if view}
                                <svelte:component this={view} item={i.item} />
                            {:else }
                                {i.item}
                            {/if}
                        </a>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>
<style lang="scss">
    @import "bulma/sass/utilities/derived-variables";
    @import "src/client/mixin";
    @import "src/client/variables";
    .dropdown, .dropdown-trigger, .dropdown-menu {
      width: 100%;
    }
    
    .refresh-button {
      pointer-events: auto;
      &:hover {
        color: $link;
      }
    }

    .dropdown-content {
      @include scroll-bar();
      max-height: 350px;
      border-radius: $default-radius;
      box-shadow: $box-shadow;
    }

    .dropdown-item {
      padding: 0.375rem 1rem;
      &:hover {
        border-radius: 16px;
      }
      &.is-active {
        color: black;
        border-radius: 16px;
        background-color: $grey-lighter;
      }
    }
</style>
