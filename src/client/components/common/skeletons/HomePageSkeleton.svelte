<script lang="ts">
    import {SkeletonBlock} from "skeleton-elements/svelte";
    import {borderRadius} from "../../../utils/consts";
</script>
<div class="tile is-ancestor">
    <div class="tile">
        <div class="tile mr-3 ml-3 is-vertical">
            <div class="tile mb-3">
                <SkeletonBlock effect="wave" tag="div" width="100%" borderRadius="{borderRadius}" height="100%" />
            </div>
            <div class="tile">
                <div class="tile mr-3">
                    <SkeletonBlock effect="wave" tag="div" width="100%" borderRadius="{borderRadius}" height="100%" />
                </div>
                <div class="tile mb-0">
                    <SkeletonBlock effect="wave" tag="div" width="100%" borderRadius="{borderRadius}" height="100%" />
                </div>
            </div>
        </div>
    </div>
    <div class="tile is-5">
        <SkeletonBlock effect="wave" tag="div" width="100%" borderRadius="{borderRadius}" height="100%" />
    </div>
</div>