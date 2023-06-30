<script lang="ts">
    import type {GigSite} from '../../stores/sites';
    import DCFlag from "../../components/forms/DCFlag.svelte";

    export let item: GigSite;
</script>

<div class="site is-flex is-justify-content-space-between is-align-items-center">
    <div class="is-clipped">
        <div class="ellipsis is-size-5 is-bold mb-1">
            {item.baseDomain}
            <span class="is-size-7 has-text-danger-dark">&nbsp;({item.siteId})</span>
        </div>
        <div class="ellipsis is-size-7 has-text-success-dark">{item.apiKey}</div>
    </div>
    <div class="is-flex-shrink-0">
        <DCFlag value={item.dc} showName={false} />
    </div>
</div>
