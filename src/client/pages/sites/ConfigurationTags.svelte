<script lang="ts">
    import TagList from "../../components/tags/TagList.svelte";
    import {BulmaColor} from "../../utils/types";
    import type {RunConfiguration, SiteRunConfiguration} from '../../stores/sites';
    import Tag from "../../components/tags/Tag.svelte";
    import {find} from 'lodash';

    export let config: RunConfiguration = null;
    export let show: 'all' | 'site' | 'run' = 'all';
    let siteTags = [];

    function getColor(tag: string) {
        switch (tag) {
            case 'SSO': return BulmaColor.Danger;
            case 'SAML': return BulmaColor.Success;
            case 'OIDC': return BulmaColor.Warning;
            default: return BulmaColor.Link;
        }
    }

    function addSiteTags(sites: SiteRunConfiguration[]) {
        siteTags = [
            find(sites, s => !!s.sso) ? 'SSO' : null,
            find(sites, s => !!s.saml) ? 'SAML' : null,
            find(sites, s => !!s.oidc) ? 'OIDC' : null
        ].filter(s => !!s);
    }

    $: addSiteTags(config?.sites)
    $: tags = config?.tags || [];
</script>
{#if config?.tags?.length || siteTags.length}
<TagList>
    {#if siteTags.length && (show === 'site' || show === 'all')}
        {#each siteTags as t}
            <Tag label={t} color={getColor(t)} isLight={true} />
        {/each}
    {/if}
    {#if config.tags.length && (show === 'run' || show === 'all')}
        {#each tags as t}
            <Tag label={t} color={BulmaColor.Link} isLight={true} />
        {/each}
    {/if}
</TagList>
{/if}