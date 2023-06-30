<script lang="ts">
    import {onMount} from 'svelte';

    let element: HTMLDivElement;

    function scrollHorizontal(event: WheelEvent) {
        const delta = event.deltaY;
        if (event.deltaY > 0) {
            element.scrollBy({left: delta});
        } else {
            element.scrollBy({left: delta});
        }
    }

    function scrollToStart() {
        element.scroll({left: 0});
    }

    onMount(() =>{
        const observer = new MutationObserver(scrollToStart);
        observer.observe(element, { childList: true });
        return () => {
            observer.disconnect();
        }
    })
</script>

<div bind:this={element} class="tile is-flex view p-1 {$$props.class || ''}" on:wheel|passive={scrollHorizontal}>
    <slot />
</div>

<style lang="scss">
    .view {
      overflow: auto;
      /* width */
      &:hover {
        &::-webkit-scrollbar-thumb {
          background: #888;
        }
      }

      &::-webkit-scrollbar {
        height: 1px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
        display: none;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 3px;
      }
    }
</style>

