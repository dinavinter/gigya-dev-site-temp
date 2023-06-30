<script lang="ts">
    import {siteSettings} from '../../stores/site-settings';
    import Tag from "../tags/Tag.svelte";
    import {toastStore} from '../../stores/toasts/store';
    import {showInfoToast} from '../../stores/toasts/actions';
    import {BulmaColor} from "../../utils/types";
    import DCFlag from "../forms/DCFlag.svelte";
    import {hasSession, isGigyaServiceReady} from "../../stores/gigya";
    import GigyaEvents from "./GigyaEvents.svelte";
    import {SkeletonBlock} from "skeleton-elements/svelte";

    function copyToClipboard(label, text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                toastStore.dispatch(showInfoToast({
                    message: `${label} was copied to clipboard`
                }))
            });
    }

</script>

<div class="box m-3 py-1 pr-1 is-flex is-justify-content-space-between is-align-items-center">
    <a href class="has-text-info-dark is-bold" on:click|preventDefault={() => copyToClipboard('ApiKey',$siteSettings.apiKey)}>{$siteSettings.apiKey || 'NA'}</a>
    <Tag label={$hasSession ? 'LOGGED IN' : 'LOGGED OUT'} color={$hasSession ? BulmaColor.Success : BulmaColor.Danger}/>
    <DCFlag value={$siteSettings.dc || ''} showName={true} />
    <Tag label={$siteSettings.env?.toUpperCase()} color={BulmaColor.Info}/>
    <Tag label={($siteSettings.version || 'latest').toUpperCase()} color={BulmaColor.Warning}/>
    <GigyaEvents />
</div>

<style lang="scss">
  @import "src/client/variables";
    .box {
      border-radius: $default-radius;
    }
</style>
