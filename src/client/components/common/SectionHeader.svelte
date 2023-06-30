<script lang="ts">
    import Divider from "./Divider.svelte";

    export let title: string;
</script>
<div>
    <div class="header is-flex is-justify-content-space-between is-align-items-center">
        <h1 class="title has-text-weight-light is-size-4 m-0 pl-4">
            {title}
        </h1>
        <div class="actions">
            <div class="field is-grouped">
                <div class="buttons has-addons">
                    <slot name="buttons" />
                </div>
            </div>
        </div>
    </div>
    <slot />
    <Divider />
</div>

<style lang="scss">
    .title {
      min-height: 40px;
    }
</style>