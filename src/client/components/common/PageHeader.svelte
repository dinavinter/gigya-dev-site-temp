<script lang="ts">
    export let title: string;
</script>

<div class="header py-4 px-5 mb-3 is-flex is-flex-direction-row is-justify-content-space-between is-align-items-center">
    <h1 class="title has-text-weight-light">
        {title}
    </h1>
    <slot name="actions"></slot>
</div>


<style lang="scss">
  @import "src/client/variables";
  .header {
      h1 {
        margin-bottom: 0;
        &:focus-within {
          outline: none;
        }
      }
      border-bottom: $item-border;
    }
</style>