<script lang="ts">
    import Icon from "./Icon.svelte";
    import {Link, useLocation} from 'svelte-navigator';
    export let to: string;
    export let icon: string;

    const location = useLocation();
    let cssClasses;

    function isCurrentOrPartiallyCurrent(location) {
        const path = to?.split('/').filter(x => x && x !== '*');
        const locationPath = location.pathname.split('/').filter(x => !!x);

        return path[0] === locationPath[0];
    }

    $: cssClasses = isCurrentOrPartiallyCurrent($location) ? 'is-active' : ''

</script>

<Link {to} class="link is-flex has-text-white is-align-items-center {cssClasses}">
    <span class="icon">
        <Icon path={icon} />
    </span>
</Link>

<style lang="scss">
  @import "src/client/variables";
  :global(.link) {
    border-radius: $default-radius !important;
    margin-bottom: 3px;
  }
  :global(.link:not(.is-active)) {
      &:hover {
        background-color: #4d4d4d !important;
        color: white !important;
      }
  }
</style>