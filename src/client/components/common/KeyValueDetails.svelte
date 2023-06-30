<script lang="ts">
    export let label: string;
</script>

<div class="{$$props.class}">
    <span class="label mb-1">{label}</span>
    <div>
        <slot />
    </div>
</div>