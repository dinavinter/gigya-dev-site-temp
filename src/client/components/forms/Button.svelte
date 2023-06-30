<script lang="ts">
    import Icon from "../common/Icon.svelte";
    import {BulmaColor} from '../../utils/types';

    export let title: string = null;
    export let icon: string = null;
    export let color: BulmaColor = null;
    export let size: 'normal' | 'small' | 'medium' | 'large' = 'normal';
    export let disabled = false;
</script>

<button type="button" class="button is-{color} {$$props.class || ''} is-rounded is-{size}" {disabled} on:click|preventDefault|stopPropagation>
    {#if icon}
        <span class="icon is-small">
            <Icon path={icon} size={size === 'small' ? 0.75 : 1} />
        </span>
    {/if}
    {#if (title)}
       <span>{title}</span>
    {/if}
</button>