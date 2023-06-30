<script lang="ts">
    import type { RunConfiguration} from '../../stores/sites';
    import ConfigurationTags from "./ConfigurationTags.svelte";

    export let config: RunConfiguration;
    export let isActive: boolean = false;

</script>

<li>
    <a href class="py-3 px-4 is-flex is-flex-direction-column is-justify-content-center"
       class:is-active={isActive}
       on:click|stopPropagation|preventDefault>
        <div class="is-clipped is-flex is-justify-content-space-between is-align-items-center">
            <div class="ellipsis is-size-5 is-bold">
                {config.id} ({config.sites.length})
            </div>
        </div>
        <ConfigurationTags config={config} show="all" />
    </a>
</li>

<style lang="scss">
  @import "src/client/variables";
  @import "bulma/sass/utilities/derived-variables";
  li {
    line-height: 1.25;
    a {
      min-height: 90px;
      display: block;
      text-decoration: none;
      color: $dark;
      border-left: 4px solid transparent;

      div:not(:last-child) {
        margin-bottom: 8px;
      }
      &:hover {
        background-color: #f5f5f5;
      }

      &.is-active {
        background-color: $grey-lighter;
        border-left-color: $link;;
      }

      .ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    &:not(:last-child) {
      border-bottom: $item-border;
    }
  }
</style>