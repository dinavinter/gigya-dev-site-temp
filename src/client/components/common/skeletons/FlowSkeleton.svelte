<script lang="ts">
    import {SkeletonBlock} from "skeleton-elements/svelte";
    import {borderRadius} from "../../../utils/consts";
</script>

<div class="tile ">
    <SkeletonBlock effect="wave" tag="div" width="100%" height="100%" borderRadius="{borderRadius}" />
</div>