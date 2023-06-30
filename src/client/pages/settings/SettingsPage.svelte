<script lang="ts">
    import Tab from "../../components/tabs/Tab.svelte";
    import Tabs from "../../components/tabs/Tabs.svelte";
    import {mdiLockOutline, mdiServerNetwork, mdiTools} from "@mdi/js";
    import CredentialManager from "./CredentialManager.svelte";
    import PageContent from "../../components/common/PageContent.svelte";
    import Box from "../../components/common/Box.svelte";
    import PageHeader from "../../components/common/PageHeader.svelte";
    import HostsFileManager from "./HostsFileManager.svelte";
</script>

<PageHeader title="Settings"/>
<PageContent class="tile">
    <Box class="tile is-child is-flex">
        <Tabs>
            <Tab label="Hosts" icon={mdiServerNetwork}>
                <HostsFileManager />
            </Tab>
            <Tab label="Credentials" icon={mdiLockOutline}>
                <CredentialManager />
            </Tab>
            <Tab label="Tools" icon={mdiTools}>

            </Tab>
        </Tabs>
    </Box>
</PageContent>
