<script lang="ts">
    import PageContent from "../../components/common/PageContent.svelte";
    import PageHeader from "../../components/common/PageHeader.svelte";
    import Card from "../../components/common/Card.svelte";
    import KeyValueDetails from "../../components/common/KeyValueDetails.svelte";
    import {isGigyaServiceReady} from "../../stores/gigya";
    import {toastStore} from '../../stores/toasts/store';
    import {showInfoToast} from '../../stores/toasts/actions';
    import HomePageSkeleton from "../../components/common/skeletons/HomePageSkeleton.svelte";
    import GigyaFlagList from "./GigyaFlagList.svelte";
    import Flows from "./Flows.svelte";

    function copyToClipboard(label, text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                toastStore.dispatch(showInfoToast({
                    message: `${label} was copied to clipboard`
                }))
            });
    }
</script>

<PageHeader title="Home"/>
<PageContent class="tile is-ancestor">
    {#if $isGigyaServiceReady}
        <div class="tile">
            <div class="tile mr-3 is-vertical">
                <Card class="tile p-0" title="Flows" noPadding={true}>
                    <Flows />
                </Card>
                <div class="tile">
                    <div class="tile mr-3">
                        <Card title="Build Info">
                            <KeyValueDetails class="mb-3" label="Version">
                                {window.gigya.build.version}
                            </KeyValueDetails>

                            <KeyValueDetails class="mb-3" label="Build Number">
                                {window.gigya.build.number}
                            </KeyValueDetails>
                        </Card>
                    </div>
                    <div class="tile mb-0">
                        <Card title="SSO Info">
                            <KeyValueDetails class="mb-3" label="SSO Key">
                                {#if window.gigya.partnerSettings?.ssoKey}
                                    <a href class="has-text-info-dark is-bold" on:click|preventDefault={() => copyToClipboard('SSO Key', window.gigya.partnerSettings?.ssoKey)}>
                                        {window.gigya.partnerSettings?.ssoKey}
                                    </a>
                                {:else }
                                    NA
                                {/if}
                            </KeyValueDetails>
                            <KeyValueDetails class="mb-3" label="Custom API Prefix">
                                {window.gigya.partnerSettings?.customAPIDomainPrefix || 'NA'}
                            </KeyValueDetails>
                            <KeyValueDetails class="mb-3" label="Storage Domain Override">
                                {window.gigya.thisScript?.globalConf?.storageDomainOverride || 'NA'}
                            </KeyValueDetails>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
        <div class="tile is-5">
            <Card title="Flags">
                <GigyaFlagList />
            </Card>
        </div>
    {:else}
        <HomePageSkeleton />
    {/if}
</PageContent>
