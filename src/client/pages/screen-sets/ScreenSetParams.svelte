<script lang="ts">
    import ParamCard from "./ParamCard.svelte";
    import Select from "../../components/forms/Select.svelte";
    import SelectItem from "../../components/forms/SelectItem.svelte";
    import TextInput from "../../components/forms/TextInput.svelte";
    import NumberInput from "../../components/forms/NumberInput.svelte";
    import TagsInput from "../../components/common/TagsInput.svelte";

    export let params = {}

    let internalParams = {
        mode: 'inline',
        authFlow: 'popup',
        lang: 'en',
        sessionExpiration: 0,
        enabledProviders: ['facebook', 'googleplus', 'twitter', 'linkedin', 'amazon', 'yahoo']
    }

    let onParams = {
        mode: true,
        authFlow: false,
        lang: false,
        sessionExpiration: false,
        enabledProviders: false
    }

    function updateParams(internalParams, on) {
        params = Object.keys(internalParams).reduce((params, key) => {
            if (on[key]) {
                params[key] = key === 'enabledProviders' ? internalParams[key].join(',') : internalParams[key]
            }
            return params;
        }, {});
    }

    $: updateParams(internalParams, onParams)
</script>

<div class="columns is-multiline p-2 is-variable is-2">
    <span class="column is-half">
        <ParamCard title="mode" bind:isOn={onParams.mode}>
            <Select bind:value={internalParams.mode} disabled={!onParams.mode}>
                <SelectItem value="modal">Modal</SelectItem>
                <SelectItem value="inline">Inline</SelectItem>
            </Select>
        </ParamCard>
    </span>

    <span class="column is-half">
        <ParamCard title="authFlow" bind:isOn={onParams.authFlow}>
            <Select bind:value={internalParams.authFlow} disabled={!onParams.authFlow}>
                <SelectItem value="popup">Popup</SelectItem>
                <SelectItem value="redirect">Redirect</SelectItem>
            </Select>
        </ParamCard>
    </span>

    <span class="column is-half">
        <ParamCard title="lang" bind:isOn={onParams.lang}>
            <TextInput placeholder="en" bind:value={internalParams.lang} disabled={!onParams.lang} />
        </ParamCard>
    </span>

    <span class="column is-half">
        <ParamCard title="sessionExpiration" bind:isOn={onParams.sessionExpiration}>
            <NumberInput placehoder="0" bind:value={internalParams.sessionExpiration} disabled={!onParams.sessionExpiration}/>
        </ParamCard>
    </span>

    <span class="column">
        <ParamCard title="enabledProviders" bind:isOn={onParams.enabledProviders}>
            <TagsInput bind:tags={internalParams.enabledProviders} disabled={!onParams.enabledProviders}/>
        </ParamCard>
    </span>
</div>
