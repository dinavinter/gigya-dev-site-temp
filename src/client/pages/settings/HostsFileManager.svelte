<script lang="ts">
    import Button from "../../components/forms/Button.svelte";
    import {mdiMagnify, mdiPlus, mdiServerNetworkOff, mdiSync} from "@mdi/js";
    import SidePanel from "../../components/common/SidePanel.svelte";
    import {BulmaColor} from "../../utils/types";
    import TextInput from "../../components/forms/TextInput.svelte";
    import Switch from "../../components/forms/Switch.svelte";
    import type {HostItem} from '../../stores/hosts';
    import {allHosts, createHosts, deleteHosts, hostsStore, syncHosts, updateHosts} from '../../stores/hosts';
    import Icon from "../../components/common/Icon.svelte";
    import Fuse from 'fuse.js';
    import SectionHeader from "../../components/common/SectionHeader.svelte";

    let filteredHosts: HostItem[];
    let sidePanel: SidePanel;
    let currentMode;
    let sidePanelTitle = 'Add entry'
    let filter = '';
    let currentHost: HostItem = {
        hosts: '',
        target: '',
        comment: '',
        active: true,
    };

    function onPanelClose() {
        currentHost = {
            hosts: '',
            target: '',
            comment: '',
            active: true,
        };
    }

    function openPanel(mode : 'Add' | 'Edit', data: HostItem = null) {
        currentMode = mode;
        if (mode === 'Edit') {
            currentHost = data;
        }
        sidePanelTitle = `${mode} entry`;
        sidePanel.open();
    }

    function getFilteredHosts(filter: string, allHosts: HostItem[]): HostItem[] {
        if (!filter?.length) return allHosts;
        const fuse = new Fuse(allHosts, {
            keys: ['target', 'hosts', 'comment'],
            threshold: 0.2
        });
        return fuse?.search(filter).map(x => x.item) || [];
    }

    function saveHost(host: HostItem, currentMode: 'Add' | 'Edit') {
        if (currentMode === 'Add') {
            hostsStore.dispatch(createHosts(host));
        } else {
            hostsStore.dispatch(updateHosts(host));
        }
        sidePanel.close();
    }
    
    function handleKeyUp(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            saveHost(currentHost, currentMode);
        }
    }

    $: filteredHosts = getFilteredHosts(filter, $allHosts)
</script>

<SectionHeader title="Hosts File Manager">
    <svelte:fragment slot="buttons">
        <Button icon={mdiSync} title="Sync host file" on:click={() => hostsStore.dispatch(syncHosts())} />
        <Button color="link" icon={mdiPlus} title="New entry" on:click={() => openPanel('Add')} />
    </svelte:fragment>
</SectionHeader>

<TextInput class="column is-6 p-0" bind:value={filter} icon={mdiMagnify} />
<table class="table is-fullwidth is-hoverable m-0">
    <thead>
    <tr>
        <th>Target</th>
        <th>Hosts</th>
        <th>Comment</th>
        <th>Active</th>
    </tr>
    </thead>
    <tbody>
    {#if filteredHosts.length}
        {#each filteredHosts as h (h.hosts)}
            <tr on:click={() => openPanel("Edit", h)}>
                <td>{h.target}</td>
                <td>{h.hosts}</td>
                <td>{h.comment}</td>
                <td>
                    <Switch checked={h.active} on:switch={(e) => {
                        saveHost({
                            ...h,
                            active: e.detail.checked
                        }, 'Edit');
                    }} />
                </td>
            </tr>
        {/each}
    {:else }
        <tr>
            <td colspan="4">
                <section class="empty has-text-centered has-text-grey-light py-6">
                    <p><Icon path={mdiServerNetworkOff} size="3"/></p>
                    <p class="is-size-5">No Hosts...</p>
                </section>
            </td>
        </tr>
    {/if}
    </tbody>
</table>

<SidePanel title={sidePanelTitle} bind:this={sidePanel} on:close={onPanelClose}>
    <svelte:fragment slot="content">
        <TextInput label="Target" placeholder="localhost | 127.0.0.1" bind:value={currentHost.target} on:keyup={handleKeyUp} />
        <TextInput label="Hosts" placeholder="some-domain.com" bind:value={currentHost.hosts} on:keyup={handleKeyUp} />
        <TextInput label="Comment" placeholder="# ..." bind:value={currentHost.comment} on:keyup={handleKeyUp} />
        <Switch label="Active" bind:checked={currentHost.active} />
    </svelte:fragment>
    <svelte:fragment slot="footer">
        <Button class="footer-button" title="Cancel" on:click={sidePanel.close} />
        <Button class="footer-button" title="Delete" color={BulmaColor.Danger} on:click={() => {
            hostsStore.dispatch(deleteHosts(currentHost));
            sidePanel.close();
        }} />
        <Button class="footer-button" title="Save" color={BulmaColor.Link} on:click={() => saveHost(currentHost, currentMode)}  />
    </svelte:fragment>
</SidePanel>