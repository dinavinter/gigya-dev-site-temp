<script lang="ts">
    import Icon from "./Icon.svelte";
    import {mdiContentCopy, mdiEyeOutline} from "@mdi/js";
    import {toastStore} from '../../stores/toasts/store';
    import {showInfoToast} from '../../stores/toasts/actions';

    export let value = '';

    let showContent = false;
    let encapsulateText;

    function copyContent() {
        navigator.clipboard.writeText(value)
            .then(() => toastStore.dispatch(showInfoToast({ message: 'Secret copied to clipboard'})));
    }

    $: encapsulateText = new Array(value.length).fill('●').join('');
</script>

<div class="main is-flex is-flex-direction-row is-justify-content-space-between">
    <pre class="data">
        {showContent ? value : encapsulateText}
    </pre>
    <span>
        <button class="btn" on:mousedown={() => showContent = true} on:mouseup={() => showContent = false} on:mouseleave={() => showContent = false} on:click|preventDefault>
            <Icon path={mdiEyeOutline} />
        </button>
        <button class="btn" on:click={copyContent}>
            <Icon path={mdiContentCopy} />
        </button>
    </span>
</div>

<style lang="scss">
  .main {
    max-width: 500px;

    pre.data {
      padding: 0;
      text-align: left;
      font-size: 1rem;
      white-space: pre-line;
      background-color: transparent;
      color: black;
    }

    .btn {
      cursor: pointer;
      margin: 0 6px;
      border: none;
      background-color: transparent;
    }
  }
</style>