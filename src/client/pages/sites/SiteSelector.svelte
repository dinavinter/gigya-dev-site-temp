<script lang="ts">
    import AutoComplete from "../../components/common/AutoComplete.svelte";
    import type {SiteRunConfiguration} from "../../stores/sites";
    import {effectiveSites} from "../../stores/sites";
    import SiteAutoCompleteItem from "./SiteAutoCompleteItem.svelte";
    import TagList from "../../components/tags/TagList.svelte";
    import {BulmaColor} from "../../utils/types";
    import Tag from "../../components/tags/Tag.svelte";
    import ConfigurationTags from "./ConfigurationTags.svelte";
    import TextInput from "../../components/forms/TextInput.svelte";
    import Select from "../../components/forms/Select.svelte";
    import SelectItem from "../../components/forms/SelectItem.svelte";
    import TagsInput from "../../components/common/TagsInput.svelte";
    import {http} from '../../utils/httpService';
    import {toastStore} from '../../stores/toasts/store';
    import {showErrorToast} from '../../stores/toasts/actions';
    import Divider from "../../components/common/Divider.svelte";
    import {merge} from 'lodash';
    import SiteSelectorSkeleton from "../../components/common/skeletons/SiteSelectorSkeleton.svelte";

    export let siteConfig: SiteRunConfiguration;

    export function reset() {
        siteConfigPromise = null;
        siteConfig = null;
        autoComplete.clear();
    }

    let autoComplete: AutoComplete;
    let apiKey: string;
    let siteConfigPromise;
    let screenSetIds: string[] = [];

    async function getSiteConfig() {
        const response = await http.get(`/admin/site-config`, {apiKey});
        if (response.success) {
            const siteConf = {
                ...response.siteConfig
            };
            screenSetIds = siteConf.screenSetIds;
            const config =  {
                apiKey: siteConf.apiKey,
                siteId: siteConf.siteId,
                dc: siteConf.dc,
                baseDomain: siteConf.baseDomain,
                defaultScreenSetId: 'Default',
                cname: siteConf.customApiPrefix ? `${siteConf.customApiPrefix}.${siteConf.baseDomain}` : '',
                sso: siteConf.sso.enabled ? (siteConf.sso.isGroupOwner ? 'Parent' : 'Child') : null,
                oidc: siteConf.oidc.enabled ? (siteConf.oidc.isOp ? 'OP' : 'RP') : null,
                registeredOPs: siteConf.oidc?.registeredOPs || [],
                saml: siteConf.saml.enabled ? (siteConf.saml.isIDP ? 'IdP' : 'SP') : null,
                registeredIdPs: siteConf.saml?.registeredIdPs || []
            };
            siteConfig = merge(config, (siteConfig || {} as SiteRunConfiguration));
        } else {
            siteConfigPromise = null;
            toastStore.dispatch(showErrorToast({ message: response.message }));
        }
    }

    $: apiKey = siteConfig?.apiKey
</script>

<AutoComplete bind:this={autoComplete} label="Api Key" key="apiKey" items={$effectiveSites} view={SiteAutoCompleteItem} bind:value={apiKey} on:select={() => siteConfigPromise = getSiteConfig()} />
{#if siteConfigPromise || siteConfig}
    {#await siteConfigPromise}
        <SiteSelectorSkeleton />
    {:then _ }
        <TagList>
            <Tag label={siteConfig.dc.toUpperCase()} color={BulmaColor.Link} addon={siteConfig.siteId} addonColor={BulmaColor.Dark} />
        </TagList>
        <Divider />
        <TagList>
            {#if siteConfig.sso}
                <Tag label="SSO" color={BulmaColor.Danger} addon={siteConfig.sso} isLight={true} />
            {/if}
            {#if siteConfig.saml}
                <Tag label="SAML" color={BulmaColor.Success} addon={siteConfig.saml} isLight={true} />
            {/if}
            {#if siteConfig.oidc}
                <Tag label="OIDC" color={BulmaColor.Warning} addon={siteConfig.oidc} isLight={true} />
            {/if}
        </TagList>
        <ConfigurationTags config={siteConfig} />
        <TextInput label="Base Domain" bind:value={siteConfig.baseDomain} />
        <TextInput label="CNAME Alias" bind:value={siteConfig.cname} />
        <Select label="Default Screen-Set ID" bind:value={siteConfig.defaultScreenSetId}>
            {#each screenSetIds as id}
                <SelectItem value={id}>{id}</SelectItem>
            {/each}
        </Select>
        <TagsInput label="SAML Provider" bind:tags={siteConfig.registeredIdPs} />
        <TagsInput label="OIDC Provider" bind:tags={siteConfig.registeredOPs} />
    {/await}
{/if}
