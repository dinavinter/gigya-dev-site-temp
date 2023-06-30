<script lang="ts">
    import SideNav from "./components/common/SideNav.svelte";
    import AppRoute from "./AppRoute.svelte";
    import {Router} from "svelte-navigator";
    import GigyaScript from "./components/GigyaScript.svelte";
    import Toast from "./components/toast/Toast.svelte";
    import CommandPalette from "./components/command-palette/CommandPalette.svelte";
    import SiteRunner from "./components/site-runner/SiteRunner.svelte";
</script>

<GigyaScript />
<Toast />
<SiteRunner />
<Router>
    <CommandPalette />
    <SideNav />
    <AppRoute />
</Router>
