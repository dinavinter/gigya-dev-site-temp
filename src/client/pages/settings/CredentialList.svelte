<script>
    import {mdiLockAlertOutline} from "@mdi/js";
    import Icon from "../../components/common/Icon.svelte";
    import DCFlag from "../../components/forms/DCFlag.svelte";
    import TextEncapsulation from "../../components/common/TextEncapsulation.svelte";
    import Menu from "../../components/menu/Menu.svelte";
    import MenuItem from "../../components/menu/MenuItem.svelte";
    import {createEventDispatcher} from "svelte";
    import {allCredentials} from "../../stores/credentials";

    const dispatch = createEventDispatcher();
</script>

<table class="table is-fullwidth is-hoverable">
    <thead>
    <tr>
        <th>User Key</th>
        <th>Secret</th>
        <th>Data Center</th>
        <th></th>
    </tr>
    </thead>
    <tbody>
    {#if $allCredentials.length}
        {#each $allCredentials as cred}
            <tr>
                <td>{cred.userKey}</td>
                <td><TextEncapsulation value={cred.secret} /></td>
                <td><DCFlag value={cred.dc} /></td>
                <td>
                    <Menu alignment="right">
                        <MenuItem on:click={() => dispatch('itemedit', cred)}>Edit</MenuItem>
                        <MenuItem type="divider" />
                        <MenuItem on:click={() => dispatch('itemdelete', cred)}><span class="has-text-danger">Delete</span></MenuItem>
                    </Menu>
                </td>
            </tr>
        {/each}
    {:else }
        <tr>
            <td colspan="4">
                <section class="empty has-text-centered has-text-grey-light py-6">
                    <p><Icon path={mdiLockAlertOutline} size="3"/></p>
                    <p class="is-size-5">No Credentials...</p>
                </section>
            </td>
        </tr>
    {/if}
    </tbody>
</table>

<style lang="scss">
    .table td {
      vertical-align: middle;
    }
</style>