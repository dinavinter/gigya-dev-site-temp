<script lang="ts">
    import {SkeletonBlock} from "skeleton-elements/svelte";
    import Divider from "../Divider.svelte";
    import InputSkeleton from "./InputSkeleton.svelte";
</script>
<div class="is-flex mb-4">
    <SkeletonBlock effect="wave" tag="span" width="150px" height="24px" borderRadius="12px" />
    &nbsp;&nbsp;&nbsp;
    <SkeletonBlock effect="wave" tag="span" width="120px" height="24px" borderRadius="12px" />
</div>
<Divider />
<div class="mb-5 is-flex">
    <SkeletonBlock effect="wave" tag="span" width="90px" height="24px" borderRadius="12px" />
</div>
<InputSkeleton label="Base Domain"/>
<InputSkeleton label="CNAME Alias"/>
<InputSkeleton label="Default Screen-Set ID"/>
<InputSkeleton label="SAML Provider"/>
<InputSkeleton label="OIDC Domain"/>