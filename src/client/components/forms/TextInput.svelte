<script lang="ts">
    import {uid} from '../../utils/unique-id-generator';
    import Icon from "../common/Icon.svelte";

    export let label: string = null;
    export let placeholder: string = '';
    export let icon: string = null;
    export let disabled: boolean = false;

    export let value: any = '';
    const id = uid();


</script>

<div class="field {$$props.class || ''}">
    <label class="label" for={id}>{label ?? ''}</label>
    <div class="control" class:has-icons-left={!!icon}>
        <input id={id} class="input is-rounded" type="text" placeholder={placeholder} {disabled} bind:value on:keydown on:change on:keyup>
        {#if icon}
            <span class="icon is-small is-left">
                <Icon path={icon} />
            </span>
        {/if}
    </div>
</div>
