<script lang="ts">
    import PageHeader from "../../../components/common/PageHeader.svelte";
    import PageContent from "../../../components/common/PageContent.svelte";
    import {getUrlParams} from '../../../utils/url';
    import {http} from '../../../utils/httpService';
    import Button from "../../../components/forms/Button.svelte";
    import Box from "../../../components/common/Box.svelte";
    import {BulmaColor} from "../../../utils/types";
    import {onMount} from 'svelte';
    import Loader from "../../../components/common/Loader.svelte";

    let consentObject;
    let scopes = [];
    let signing = false;

    async function signConsent() {
        signing = true;
        const obj = {
            scope: consentObject.scope,
            clientID: consentObject.clientID,
            context: consentObject.context,
            UID: consentObject.UID,
            consent: true
        }

        const response = await http.post('/admin/sign', obj);
        window.location.href = "/oidc/proxy?mode=afterConsent&consent=" + JSON.stringify(obj) + "&sig=" + response.sig;
    }

    onMount(() => {
        const urlParams = getUrlParams();
        consentObject = {};
        for (const [key, value] of urlParams.entries()) {
            consentObject[key] = value
        }
        scopes = consentObject.scope.split('+');
    })
</script>

<PageHeader title="OIDC Consent"/>
<PageContent class="tile is-ancestor is-justify-content-center is-align-items-center">
    <Box class="is-flex is-flex-direction-column is-align-items-center">
        {#if !signing}
            <img alt="logo" class="mb-6" src="/logo.svg" />
            <h1 class="title">OIDC App</h1>
            <p class="mb-3">OIDC app is requesting access to th<br>following scopes:</p>
            <div class="info">
                <ul>
                    {#each scopes as s}
                        <li>{s}</li>
                    {/each}
                </ul>
            </div>
            <div>
                <Button class="mr-6" title="Decline" />
                <Button color={BulmaColor.Link} title="Accept" on:click={signConsent}/>
            </div>
        {:else}
            <Loader size="6" />
        {/if}
    </Box>
</PageContent>

<style lang="scss">
  @import "src/client/variables";
    img {
      width: 150px;
    }
    p {
      text-align: center;
    }
    .info {
      width: 100%;
      padding: 12px;
      border: $item-border;
      margin-bottom: 16px;
      ul {
        list-style: unset;
        padding-left: 24px;
      }
    }
</style>
