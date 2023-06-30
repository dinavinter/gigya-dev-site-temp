<script lang="ts">
    import Icon from "../common/Icon.svelte";
    import {mdiChevronRight, mdiSlashForward} from "@mdi/js";
    import {tick} from 'svelte';
    import Tag from "../tags/Tag.svelte";
    import {actionStore, stack, displayActions, popAction, reset, execAction} from './action-store';
    import type {Action} from './action-store';
    import ActionItem from "./ActionItem.svelte";

    let inputElem: HTMLInputElement;
    let isActive = false;
    let selectedIndex = 0;
    let filter = '';
    let filteredActions = [];

    async function windowHandleKeyDown(event: KeyboardEvent) {
        if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
            isActive = true;
            await tick();
            inputElem.focus();
            event.preventDefault();
        } else if (event.key === 'Escape') {
            close();
        }
    }

    function onInputKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter':
                runAction(filteredActions[selectedIndex]);
                break;
            case 'ArrowUp':
                if ((selectedIndex - 1) >= 0) {
                    selectedIndex--;
                    scrollToSelectedItem(selectedIndex);
                }
                break;
            case 'ArrowDown':
                if ((selectedIndex + 1) < filteredActions.length) {
                    selectedIndex++;
                    scrollToSelectedItem(selectedIndex);
                }
                break
            case 'Backspace':
                selectedIndex = 0;
                if (filter.length === 0) {
                    actionStore.dispatch(popAction())
                }
                break
        }
    }

    function runAction(action: Action) {
        actionStore.dispatch(execAction(action));
        if (!action.children) {
            isActive = false;
        }
        filter = '';
        selectedIndex = 0;
    }

    function filterActions(actions: Action[], filter: string) {
        return actions.filter(a => a.label.toLowerCase().includes(filter.toLowerCase()))
    }

    function close() {
        isActive = false;
        filter = '';
        selectedIndex = 0;
        actionStore.dispatch(reset());
    }

    function scrollToSelectedItem(index: number) {
        const id = filteredActions[index].id;
        const elem = document.querySelector(`[data-action-id="${id}"]`)
        elem.scrollIntoView({
            block: 'nearest'
        });
    }

    $: filteredActions = filterActions($displayActions, filter);
</script>

<svelte:window on:keydown={windowHandleKeyDown} />

{#if isActive}
    <div class="backdrop is-flex is-align-items-start is-justify-content-center is-overlay">
        <div class="box p-0">
            <div class="is-flex is-align-items-center p-3">
                <Tag label="Home" />
                {#each $stack as action}
                    <Icon path={mdiSlashForward} size={.8} color="#bbb" />
                    <Tag label={action.label} />
                {/each}
            </div>
            <div class="search-box is-flex is-align-items-center">
                <Icon path={mdiChevronRight} size="1.2" color="#bbb"  />
                <input bind:this={inputElem} bind:value={filter} class="search" type="text" on:keydown={onInputKeyDown}/>
            </div>
            <div class="actions-list">
                {#each filteredActions as action, index (action.id)}
                    <ActionItem {action} isActive={index === selectedIndex} on:click={() => runAction(action)}/>
                {/each}
            </div>
        </div>
    </div>
{/if}


<style lang="scss">
    @import "bulma/sass/utilities/derived-variables";
    @import "src/client/mixin";
    @import "src/client/variables";
    .backdrop {
      z-index: 9999;
      background-color: rgba(0, 0, 0, .1);
      backdrop-filter: blur(2px);
      padding-top: 5%;

      .box {
        border-radius: $default-radius;
        overflow: hidden;
        .actions-list {
          max-height: 300px;
          padding-bottom: 8px;
          @include scroll-bar();
        }
        width: 40%;
        .search-box {
          border-bottom: $item-border;
          .search {
            width: 100%;
            padding: .6rem 1rem .6rem .2rem;
            font-size: 1.2rem;
            border: none;

            &:focus-visible {
              outline: none;
            }
          }
        }
      }
    }
</style>