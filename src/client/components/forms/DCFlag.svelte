<script lang="ts">
    import {DC} from '../../utils/types';

    export let value: DC = DC.US;
    export let showName = true;
</script>

<span class="flag is-flex is-align-items-center is-flex-direction-row">
    <img src="/flags/{value.replace(/\d/, '').replace(/(-st\d)/, '')}.svg" alt="{value} flag" />
    {#if showName}
        <span class="pl-3 is-bold">{value.toUpperCase()}</span>
    {/if}
</span>

<style lang="scss">
    .flag  {
      img{
        width: 24px;
        height: 24px;
      }
    }
</style>