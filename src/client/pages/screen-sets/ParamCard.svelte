<script lang="ts">
    import Icon from "../../components/common/Icon.svelte";
    import {mdiCheckCircleOutline, mdiCircleOutline} from "@mdi/js";

    export let title: string;
    export let isOn = false;
</script>

<div class="card is-flex-grow-1 {$$props.class || ''}">
    <header class="card-header">
        <p class="card-header-title m-0">
            {title}
        </p>
        <button class="card-header-icon py-0" on:click={() => isOn = !isOn}>
            <Icon size="0.7" path={isOn ? mdiCheckCircleOutline: mdiCircleOutline} color={isOn ? 'green' : 'currentColor'} />
        </button>
    </header>
    <div class="card-content p-3">
        <div class="content">
            <slot />
        </div>
    </div>
</div>

<style lang="scss">
  .card {
    .card-header {
      min-width: 0;
      .card-header-title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-right: 0;
      }
    }
  }
</style>