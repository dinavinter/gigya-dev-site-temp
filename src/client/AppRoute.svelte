<script lang="ts">
    import {Route} from "svelte-navigator";
    import SitesPage from "./pages/sites/SitesPage.svelte";
    import HomePage from "./pages/home/HomePage.svelte";
    import ScreenSetsPage from "./pages/screen-sets/ScreenSetsPage.svelte";
    import SettingsPage from "./pages/settings/SettingsPage.svelte";
    import SAMLProxy from "./pages/home/flows/SAMLProxy.svelte";
    import SAMLLogout from "./pages/home/flows/SAMLLogout.svelte";
    import OIDCProxy from "./pages/home/flows/OIDCProxy.svelte";
    import OIDCConsent from "./pages/home/flows/OIDCConsent.svelte";
    import SiteDetails from "./components/site-details/SiteDetails.svelte";
    import FlowPage from "./pages/home/flows/FlowPage.svelte";
    import Login from "./pages/home/flows/Login.svelte";
</script>

<main class="is-flex is-flex-direction-column is-flex-grow-1 has-background-white-ter">
    <SiteDetails />
    <Route path="/sites">
        <SitesPage />
    </Route>
    <Route path="/screen-sets">
        <ScreenSetsPage />
    </Route>
    <Route path="/settings">
        <SettingsPage />
    </Route>
    <Route path="/saml/proxy">
        <SAMLProxy />
    </Route>
    <Route path="/saml/logout">
        <SAMLLogout />
    </Route>
    <Route path="/oidc/proxy">
        <OIDCProxy />
    </Route>
    <Route path="/oidc/consent">
        <OIDCConsent />
    </Route>
    <Route path="/lite/account-progression">
        <FlowPage title="Lite Account Progression" screenSetId="RegistrationLogin" startScreen="gigya-lite-account-progression-screen" />
    </Route>
    <Route path="/update-profile">
        <FlowPage title="Profile Update" screenSetId="ProfileUpdate" requireSession={true} />
    </Route>
    <Route path="/login">
        <Login />
    </Route>
    <Route path="/">
        <HomePage />
    </Route>
</main>
