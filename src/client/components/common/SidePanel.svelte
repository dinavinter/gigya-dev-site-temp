<script lang="ts">
    import Icon from "./Icon.svelte";
    import {mdiClose} from "@mdi/js";
    import {createEventDispatcher} from 'svelte';
    import {clickOutside} from '../../utils/clickOutside';

    export let title = null;
    let _open = false;
    let dispatch = createEventDispatcher();

    export function open() {
        _open = true;
    }

    export function close() {
        _open = false;
        dispatch('close');
    }
</script>

<div class="side-panel card is-fullheight" class:is-active={_open} use:clickOutside on:clickoutside={close}>
    <div class="card-header">
        <div class="card-header-title">{title}</div>
        <button class="card-header-icon" on:click={close}>
            <span class="icon">
                <Icon path={mdiClose} size={.7} />
            </span>
        </button>
    </div>
    <div class="card-content">
        <div class="content">
            <slot name="content" />
        </div>
    </div>
    {#if $$slots.footer}
    <footer class="card-footer p-2 is-flex is-justify-content-space-evenly">
        <slot name="footer" />
    </footer>
    {/if}
</div>

<style lang="scss">
  @import "src/client/mixin";
  @import "src/client/variables";
  .side-panel {
      border-radius: $default-radius;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 16px;
      bottom: 16px;
      right: -470px;
      width: 450px;
      z-index: 10;
      transition: .2s right ease-in-out;

      .card-header-title {
        white-space: nowrap;
      }

      .card-content {
        @include scroll-bar();
        flex-grow: 1;
      }
      &.is-active {
        right: 8px;
      }
    }

    :global(.footer-button) {
      width: 33%;
      &:not(:last-child) {
        margin-right: 1.5rem;
      }
    }
</style>