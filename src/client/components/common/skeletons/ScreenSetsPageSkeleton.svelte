<script lang="ts">
    import {SkeletonBlock} from "skeleton-elements/svelte";
    import {borderRadius} from "../../../utils/consts";
</script>

<div class="tile is-vertical">
    <SkeletonBlock effect="wave" tag="div" width="100%" height="50px" borderRadius="{borderRadius}" />
    <div class="tile mt-4 ">
        <div class="tile is-vertical params mr-4">
            <div class="tile mb-4">
                <SkeletonBlock effect="wave" tag="div" width="100%" borderRadius="{borderRadius}" height="100%" />
            </div>
            <div class="tile is-flex-grow-0">
                <SkeletonBlock effect="wave" tag="div" width="100%" height="50px" borderRadius="{borderRadius}" />
            </div>
        </div>
        <div class="tile is-vertical">
            <div class="tile is-flex-grow-0 mb-4">
                <SkeletonBlock effect="wave" tag="div" width="100%" height="50px" borderRadius="{borderRadius}" />
            </div>
            <div class="tile">
                <SkeletonBlock effect="wave" tag="div" width="100%" height="100%" borderRadius="{borderRadius}" />
            </div>
        </div>
    </div>
</div>