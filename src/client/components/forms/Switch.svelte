<script lang="ts">
    import {uid} from '../../utils/unique-id-generator';
    import {BulmaColor} from '../../utils/types';
    import {createEventDispatcher} from 'svelte';

    export let label: string = null;
    export let color: BulmaColor = BulmaColor.Link;
    export let checked: boolean = true;
    export let disabled = false;
    const id = uid();

    const dispatch = createEventDispatcher();

    function onSwitchChanged(event) {
        checked = event.target.checked;
        dispatch('switch', { checked });
    }
</script>

<div class="field">
    {#if label}
    <label class="mb-2" for={id}>
        {label}
    </label>
    {/if}
    <div class="is-flex is-align-items-center">
        <input id={id} type="checkbox" class="switch is-{color}" {checked} on:click|stopPropagation on:change={onSwitchChanged} {disabled}>
    </div>
</div>

<style lang="scss">
  @import "bulma/sass/utilities/derived-variables";

  .field {
    label {
      font-weight: 700;
      display: block;

    }
    .switch {
      appearance: none;
      position: relative;
      width: 48px;
      height: 24px;
      border-radius: 1.5rem;
      background: #b5b5b5;
      cursor: pointer;

      &.is-link:checked {
        background-color: $link;
      }
      &.is-success:checked {
        background-color: $success;
      }
      &.is-danger:checked {
        background-color: $danger;
      }
      &.is-warning:checked {
        background-color: $warning;
      }
      &.is-info:checked {
        background-color: $info;
      }
      &.is-primary:checked {
        background-color: $primary;
      }
      &.is-dark:checked {
        background-color: $dark;
      }

      &[disabled] {
        cursor: not-allowed;
      }

      &:after {
        display: block;
        position: absolute;
        top: 1px;
        left: 1px;
        width: 22px;
        height: 22px;
        transform: translate3d(0, 0, 0);
        border-radius: 50%;
        background: #fff;
        transition: all 0.25s ease-out;
        content: '';
      }

      &:checked:after {
        left: 25px;
      }
    }
  }
</style>