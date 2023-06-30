<script lang="ts">
    import Icon from "../common/Icon.svelte";
    import {mdiDotsVertical} from '@mdi/js';
    import {clickOutside} from '../../utils/clickOutside';

    export let icon = mdiDotsVertical;
    export let text = null;
    export let alignment: 'right' | 'left' = 'left';

    let isOpen = false;
</script>

<div class="dropdown is-{alignment}" class:is-active={isOpen}>
    <div class="dropdown-trigger">
        <button class="button is-white is-rounded" on:click={() => isOpen = true } use:clickOutside on:clickoutside={() => isOpen = false}>
            {#if text}
            <span>{text}</span>
            {/if}
            <span class="icon is-small">
                <Icon path={icon} />
            </span>
        </button>
    </div>
    <div class="dropdown-menu">
        <div class="dropdown-content p-1">
            <slot />
        </div>
    </div>
</div>

<style lang="scss">
  @import "src/client/variables";
  .dropdown-content {
      border-radius: $default-radius;
    }
</style>