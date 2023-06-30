<script lang="ts">
    import {uid} from '../../utils/unique-id-generator';
    import Icon from "../common/Icon.svelte";
    import {mdiChevronDown} from "@mdi/js";
    import {writable} from 'svelte/store';
    import {setContext} from 'svelte';
    import {clickOutside} from '../../utils/clickOutside';

    export let label: string = '';
    export let placeholder: string = '- Select -';
    export let value: any;
    export let disabled: boolean = false;

    let isActive = false;
    let id = uid();
    let selectedValue = writable(value);
    let items = new Set();

    let selectConfig = {
        selectedValue,
        addItem: value => {
            if (items.has(value)) {
                throw `${value} is already exists`;
            }
            items.add(value);
        },
        removeItem: value => {
            items.delete(value);
        }
    };

    selectedValue.subscribe(val => {
        if (value !== val) {
            value = val;
        }
        isActive = false;
    });

    setContext('select', selectConfig);

    function toggleMenu() {
        isActive = !isActive;
    }

    $: $selectedValue = value
</script>

<div class="field" use:clickOutside on:clickoutside={() => isActive = false}>
    {#if label}
        <label class="label" for={id}>{label}</label>
    {/if}
    <div class="dropdown" class:disabled={disabled} class:is-active={isActive}>
        <div class="dropdown-trigger">
            <button class="button is-flex is-justify-content-space-between is-rounded" aria-haspopup="true" {disabled} aria-controls={id} on:click={toggleMenu}>
                <span>{$selectedValue || placeholder || '-- Select Item --'}</span>
                <span class="icon is-small">
                <Icon size={.7} path={mdiChevronDown} />
            </span>
            </button>
        </div>
        <div class="dropdown-menu" id={id} role="menu">
            <div class="dropdown-content">
                <slot />
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @import "src/client/mixin";
    @import "src/client/variables";
    .dropdown, .dropdown-trigger, .button, .dropdown-menu {
      width: 100%;
    }
    .dropdown-trigger button:disabled {
      color: hsl(0deg, 0%, 0%);
      background-color: hsl(0deg, 0%, 92%);
      border-color: hsl(0deg, 0%, 92%);
    }
    .dropdown-menu {
      @include scroll-bar();
      max-height: 300px;
      overflow: auto;
      box-shadow: $box-shadow;
      border-radius: $default-radius;
      min-width: auto;
    }
</style>