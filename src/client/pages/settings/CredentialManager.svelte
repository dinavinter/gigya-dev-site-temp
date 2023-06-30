<script lang="ts">
    import Button from "../../components/forms/Button.svelte";
    import {mdiExport, mdiImport, mdiPlus} from "@mdi/js";
    import {BulmaColor} from "../../utils/types";
    import CredentialList from "./CredentialList.svelte";
    import SidePanel from "../../components/common/SidePanel.svelte";
    import TextInput from "../../components/forms/TextInput.svelte";
    import PasswordInput from "../../components/forms/PasswordInput.svelte";
    import DCSelect from "../../components/forms/DCSelect.svelte";
    import type {GigCredential} from '../../stores/credentials';
    import {
        allCredentials,
        createCredential,
        credentialStore,
        deleteCredential,
        updateCredential
    } from '../../stores/credentials';
    import SectionHeader from "../../components/common/SectionHeader.svelte";

    let sidePanelTitle: string =`New Credential`;
    let sidePanel: SidePanel;
    let fileInput: HTMLInputElement;
    let currentMode: 'New' | 'Edit';
    let files = [];

    let currentCred: GigCredential = {
        userKey: '',
        secret: '',
        dc: null
    }

    function openPanel(mode : 'New' | 'Edit', data = null) {
        currentMode = mode;
        if (mode === 'Edit') {
            currentCred = data;
        }
        sidePanelTitle = `${mode} Credential`;
        sidePanel.open();
    }

    function onPanelClose() {
        currentCred = {
            userKey: '',
            secret: '',
            dc: null
        }
    }

    async function syncCredential() {
        if (currentMode === 'New') {
            credentialStore.dispatch(createCredential(currentCred));
        } else if (currentMode === 'Edit') {
            credentialStore.dispatch(updateCredential(currentCred));
        }
        sidePanel.close();
        currentMode = null;
    }

    async function removeCredential(data) {
        credentialStore.dispatch(deleteCredential(data.detail));
    }

    function downloadFile(data) {
        const a = document.createElement('a');
        const file = new Blob([JSON.stringify(data)], { type: 'application/json'});
        a.href = URL.createObjectURL(file);
        a.download = 'credential.json';
        a.click()
    }

    function importData() {
        fileInput.addEventListener('change', (e: any) => {
            const file = e.target.files[0];
            if (!file) {
                return
            }

            const reader = new FileReader();
            reader.onload = async (ev: any) => {
                const data = JSON.parse(ev.target.result);
                if (data) {
                    for (const c of data) {
                        credentialStore.dispatch(createCredential(c));
                    }
                }
            };
            reader.readAsText(file);

        })
        fileInput.click();
    }
</script>

<SectionHeader title="Credential Manager">
    <svelte:fragment slot="buttons">
        <Button icon={mdiExport} title="Export" on:click={() => downloadFile($allCredentials)} />
        <Button icon={mdiImport} title="Import" on:click={importData} />
        <Button icon={mdiPlus} title="New"  color={BulmaColor.Link} on:click={()=> openPanel('New')} />
    </svelte:fragment>
</SectionHeader>
<input class="hide" name="file upload" type="file" bind:this={fileInput} accept="application/json"/>

<CredentialList on:itemdelete={removeCredential} on:itemedit={event => openPanel('Edit', event.detail)}/>
<SidePanel title={sidePanelTitle} bind:this={sidePanel} on:close={onPanelClose}>
    <svelte:fragment slot="content">
        <DCSelect bind:value={currentCred.dc} />
        <TextInput label="User Key" bind:value={currentCred.userKey} />
        <PasswordInput label="Secret" bind:value={currentCred.secret} />
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <Button class="footer-button" title="Cancel" on:click={sidePanel.close} />
        <Button class="footer-button" title="Save" color={BulmaColor.Link} on:click={syncCredential}  />
    </svelte:fragment>
</SidePanel>

<style lang="scss">
    .hide {
      overflow: hidden;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: 0;
      opacity: 0;
    }
</style>