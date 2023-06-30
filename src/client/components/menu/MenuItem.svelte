<script lang="ts">
    export let type: 'item' | 'divider' = 'item';
</script>

{#if type === 'divider'}
    <hr class="dropdown-divider" />
{/if}

{#if type === 'item'}
    <a href class="dropdown-item" on:click|preventDefault>
        <slot />
    </a>
{/if}

<style lang="scss">
  @import "src/client/variables";
  .dropdown-item {
      &:hover {
        border-radius: $default-radius;
      }
    }
</style>

