<script lang="ts">
    import {SkeletonBlock, SkeletonText} from "skeleton-elements/svelte";
    import {borderRadius} from "../../../utils/consts";

    export let label: string;
</script>

<div class="mt-2">
    <div class="mb-2">
        <SkeletonText effect="wave">{label}</SkeletonText>
    </div>
    <SkeletonBlock effect="wave" tag="span" width="100%" height="40px" borderRadius="{borderRadius}" />
</div>