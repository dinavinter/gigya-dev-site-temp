<script lang="ts">
    import {mdiHome, mdiWeb, mdiMonitorDashboard, mdiCogs} from "@mdi/js";
    import NavLink from "./NavLink.svelte";
</script>

<aside class="box has-background-dark has-text-white-ter is-radiusless m-0 p-2 is-flex is-flex-direction-column is-justify-content-space-between is-open">
    <div class="top mt-4 is-flex is-flex-direction-column is-justify-content-center">
        <img src="/g-logo.svg" alt="logo" class="mb-6" />
        <div class="menu">
            <ul class="menu-list">
                <li>
                    <NavLink to="/" icon={mdiHome} />
                </li>
                <li>
                    <NavLink to="/screen-sets" icon={mdiMonitorDashboard} />
                </li>
                <li>
                    <NavLink to="/sites" icon={mdiWeb} />
                </li>
            </ul>
        </div>
    </div>
    <div class="bottom is-flex is-flex-direction-column">
        <div class="menu">
            <ul class="menu-list">
                <li>
                    <NavLink to="/settings" icon={mdiCogs} />
                </li>
            </ul>
        </div>
    </div>
</aside>

<style lang="scss">
  @import "src/client/variables";
  aside {
      box-shadow: $box-shadow;

      z-index: 1;
      overflow: hidden;
      min-width: 64px;

      img {
        height: 40px;
        object-fit: contain;
      }
    }
</style>
