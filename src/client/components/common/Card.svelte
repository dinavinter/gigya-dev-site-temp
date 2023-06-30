<script lang="ts">
    import Icon from "./Icon.svelte";
    import {mdiChevronDown, mdiChevronUp} from "@mdi/js";
    import {createEventDispatcher} from 'svelte';

    export let title: string;
    export let collapsable: boolean = false;
    export let open: boolean = true;
    export let noPadding:boolean = false;

    const dispatch = createEventDispatcher();

    function collapse() {
        open = !open;
        dispatch('collapse', {open})
    }
</script>

<div class="card tile is-flex is-flex-direction-column" class:is-collapsed={!open}>
    <header class="card-header">
        <p class="card-header-title">
            {title}
        </p>
        {#if collapsable}
            <button class="card-header-icon" on:click|stopPropagation={collapse}>
                <Icon path={open ? mdiChevronDown : mdiChevronUp} />
            </button>
        {/if}
    </header>
    <div class="card-content" class:p-3={!noPadding}  class:p-0={noPadding} class:is-collapsed={!open}>
        <div class="content {$$props.class || ''}">
            <slot />
        </div>
    </div>
</div>

<style lang="scss">
  @import "src/client/mixin";
  @import "src/client/variables";
    .card {
      border-radius: $default-radius;
      overflow: hidden;

      &.is-collapsed {
        flex-grow: 0;
        flex-basis: auto;
      }

      &:not(:last-child) {
        margin-bottom: .7rem;
      }
      .card-content {
        @include scroll-bar();
        height: 100%;
        &.is-collapsed {
          height: 0 !important;
          padding: 0 !important;
        }
      }
    }
</style>