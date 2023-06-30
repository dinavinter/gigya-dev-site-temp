<script lang="ts">
    import SelectItem from "./SelectItem.svelte";
    import Select from "./Select.svelte";
    import {DC} from "../../utils/types";
    import DCFlag from "./DCFlag.svelte";

    export let value: DC;
    export let disabled: boolean = false;
</script>

<Select label="Data Center" placeholder="--Select Data Center--" bind:value {disabled}>
    <SelectItem value={DC.US}><DCFlag value={DC.US} /></SelectItem>
    <SelectItem value={DC.EU2}><DCFlag value={DC.EU2} /></SelectItem>
    <SelectItem value={DC.IL}><DCFlag value={DC.IL} /></SelectItem>
    <SelectItem value={DC.CN}><DCFlag value={DC.CN} /></SelectItem>
</Select>