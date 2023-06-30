<script lang="ts">
    import type {Action} from './action-store';
    import Icon from "../common/Icon.svelte";
    import {mdiChevronRight} from "@mdi/js";

    export let action: Action;
    export let isActive = false;
</script>

<div class="action" data-action-id={action.id}>
    <a class="is-flex is-justify-content-space-between px-4 py-2" class:is-active={isActive} href on:click|preventDefault>
        <span>{action.label}</span>
        {#if action.children?.length}
            <Icon path={mdiChevronRight} color="#bbb" />
        {/if}
    </a>
</div>

<style lang="scss">
  @import "bulma/sass/utilities/derived-variables";
  @import "src/client/variables";
  .action {
    border-bottom: $item-border;
    a {
      display: block;
      color: $dark;
      border-left: 4px solid #fff;
      &.is-active {
        border-left: 4px solid $link;
        background-color: $link-light;
      }
    }
  }
</style>