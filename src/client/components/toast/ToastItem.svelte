<script lang="ts">
    import { tweened } from 'svelte/motion'
    import { linear } from 'svelte/easing'
    import { onMount } from 'svelte';
    import type {Toast} from '../../stores/toasts/models';
    import {toastStore} from '../../stores/toasts/store';
    import {removeToast} from '../../stores/toasts/actions';

    export let item: Toast;
    let paused = false;

    const progress = tweened(0, { duration: item?.timeout, easing: linear })

    function close() {
        toastStore.dispatch(removeToast({id: item.id}));
    }

    function pause() {
        if (!paused) {
            progress.set($progress, {duration: 0})
            paused = true;
        }
    }

    function resume() {
        if (paused) {
            const duration = item.timeout - item.timeout * ($progress / 100);
            progress.set(100, { duration }).then(close);
            paused = false;
        }
    }

    onMount(() => {
        progress.set(100).then(close);
    });
</script>

<div class="notification is-light{item.type === '' ? '' : ` is-${item.type}`}" on:mouseenter={pause} on:mouseleave={resume}>
    <button class="delete" on:click|preventDefault={close}></button>
    {@html item.message}
    <div class="timeout">
        <div class="status{item.type === '' ? ' has-background-grey-dark' : ` has-background-${item.type}`}" style="width: {100 - $progress}%;"></div>
    </div>
</div>

<style lang="scss">
  @import "src/client/variables";
    .notification {
      border-radius: 1.2rem;
      overflow: hidden;
      position: relative;
      box-shadow: $box-shadow;
      margin: 0 auto;
      .timeout {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 5px;
        .status {
          height: 100%;
        }
      }
    }
</style>