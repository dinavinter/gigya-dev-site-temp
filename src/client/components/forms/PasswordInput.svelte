<script lang="ts">
    import {uid} from '../../utils/unique-id-generator';

    export let label: string;
    export let placeholder: string = '';

    export let value: any;
    const id = uid();
</script>

<div class="field">
    <label class="label" for={id}>{label}</label>
    <div class="control">
        <input id={id} class="input is-rounded" type="password" placeholder={placeholder} bind:value>
    </div>
</div>
