<script lang="ts">
    import Tag from "../tags/Tag.svelte";
    import {BulmaColor} from "../../utils/types";
    import {uid} from '../../utils/unique-id-generator';

    export let tags: string[] = [];
    export let label: string = '';
    export let disabled: boolean = false;
    let isActive = false;
    let inputElem: HTMLInputElement;
    let currentValue: string = '';
    const id = uid()

    function handleKeyUp(event: KeyboardEvent) {
        switch (event.key) {
            case 'Enter':
                if (currentValue.length === 0) return;
                tags = [...tags, currentValue];
                currentValue = '';
                break;
            case 'Backspace':
                if (currentValue.length === 0) {
                    tags.pop();
                    tags = [...tags];
                }
                break;
        }
    }

    function onFocus(){
        isActive = true;
    }

    function onBlur() {
        isActive = false;
    }

    function removeItem(tag: string) {
        tags = tags.filter(t => t !== tag)
    }
</script>
<div class="field {$$props.class || ''}" on:click={() => !disabled && inputElem.focus()} class:disabled={disabled}>
    <label class="label" for={id}>{label ?? ''}</label>
    <div class="input is-flex is-flex-wrap-wrap" class:active={isActive}>
        {#if disabled}
            <div class="overlay"></div>
        {/if}
        {#each tags as tag}
            <Tag label={tag} color={BulmaColor.Link} closeable={true} on:delete={() => removeItem(tag)} />
        {/each}
        <input bind:this={inputElem} id={id} class="is-flex-grow-1" type="text" bind:value={currentValue} on:focus={onFocus} on:blur={onBlur} on:keydown={handleKeyUp} />
    </div>
</div>

<style lang="scss">
    .disabled {
      .input {
        background-color: hsl(0deg, 0%, 96%);
        border-color: hsl(0deg, 0%, 96%);
        box-shadow: none;
        color: hsl(0deg, 0%, 48%);
        cursor: not-allowed;
      }
    }

    .input {
      position: relative;
      cursor: text;
      padding: 7px 17px 0;
      min-height: 40px;
      height: auto;
      border-radius: 22px;

      input {
        height: 0;
        border: none;
        background-color: transparent;
        &:focus {
          height: auto;
          margin-bottom: 5px;
        }
        &:focus-visible {
          outline: 0;
        }
      }
      &.active {
        border-color: hsl(229deg, 53%, 53%);
        box-shadow: 0 0 0 0.125em rgb(72 95 199 / 25%);
      }
      :global(.control) {
        margin-right: 8px;
        margin-bottom: 7px;
      }
    }
    .overlay {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 1;
    }
</style>