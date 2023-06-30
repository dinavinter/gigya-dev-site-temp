<script lang="ts">
    import {fly, fade} from 'svelte/transition'
    import {flip} from 'svelte/animate'
    import ToastItem from './ToastItem.svelte';
    import {allToast} from '../../stores/toasts/store';
</script>

<ul class="toast-container">
    {#each $allToast as i (i.id)}
        <li class="item"
            in:fly|local={{y: 500}}
            out:fade|local
            animate:flip|local={{duration: 250}}>
            <ToastItem item={i} />
        </li>
    {/each}
</ul>

<style lang="scss">
    .toast-container {
      position: fixed;
      bottom: 1rem;
      left: 50%;
      translate: -50% 0;
      z-index: 99999;
      .item {
        &:not(:last-child) {
          margin-bottom: 1rem;
        }
        width: 350px;
      }
    }
</style>