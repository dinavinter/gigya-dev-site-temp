<script lang="ts">
    import {flows} from "./flows/flows";
    import Icon from "../../components/common/Icon.svelte";
    import {Link} from "svelte-navigator";
</script>

<div class="flows columns is-gapless is-multiline is-flex-grow-1">
    {#each flows as f}
        {#if f.path}
            <Link class="flow column is-one-third" to={f.path}>
                <div class="py-4 is-flex is-flex-direction-column is-align-items-center">
                    <Icon path={f.icon} color="#3e8ed0" size={1.2} />
                    <span>{f.label}</span>
                </div>
            </Link>
        {:else}
            <a href class="flow column is-one-third" on:click|preventDefault={f.exec}>
                <div class="py-5 is-flex is-flex-direction-column is-align-items-center">
                    <Icon path={f.icon} color="#3e8ed0" size={1.2} />
                    <span>{f.label}</span>
                </div>
            </a>
        {/if}
    {/each}
</div>

<style lang="scss">
  @import "src/client/variables";
  .flows {
    :global(a) {
      color: black;
    }
    :global(.flow) {
      border-bottom: $item-border;

      &:nth-child(3n+1) {
        border-right: $item-border;
      }
      &:nth-child(3n+2) {
        border-right: $item-border;
      }
    }
  }
</style>