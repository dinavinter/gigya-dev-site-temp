<script lang="ts">
    import PageContent from "../../components/common/PageContent.svelte";
    import PageHeader from "../../components/common/PageHeader.svelte";
    import Box from "../../components/common/Box.svelte";
    import type {ScreenSet} from "../../stores/gigya";
    import {isGigyaServiceReady, screenSets} from "../../stores/gigya";
    import VerticalScrollView from "../../components/common/VerticalScrollView.svelte";
    import Card from "../../components/common/Card.svelte";
    import ScreenSetParams from "./ScreenSetParams.svelte";
    import ScreenSetEvents from "./ScreenSetEvents.svelte";
    import ScreenSetsPageSkeleton from "../../components/common/skeletons/ScreenSetsPageSkeleton.svelte";
    import ScreenSetView from "./ScreenSetView.svelte";

    let currentScreenSet: ScreenSet & {
        selectedScreen?: string;
    };
    let showEvents = false;
    let showParams = true;
    let params;
    let screenSetParams;
    let events;


    function selectScreenSet(screenSet: ScreenSet) {
        if (!screenSet) return;

        currentScreenSet = {
            ...screenSet,
            selectedScreen: null
        };
    }

    function showScreenSet() {
        screenSetParams = {
            screenSet: currentScreenSet.screenSetId,
            startScreen: currentScreenSet.selectedScreen,
            ...params,
            ...events
        }
    }

    $: selectScreenSet($screenSets[0] || null)
</script>


<PageHeader title="Screen Sets"/>
<PageContent class="tile is-ancestor is-vertical">
    {#if $isGigyaServiceReady && $screenSets?.length}
        <div class="tile mb-3 is-flex-grow-0 is-flex-basis-auto">
            <div class="is-flex screen-sets tile">
                <VerticalScrollView>
                    {#each $screenSets as s (s.screenSetId)}
                        <a href
                           class:is-active={currentScreenSet.screenSetId === s.screenSetId}
                           on:click|preventDefault={() => selectScreenSet(s)}
                           class="is-flex-shrink-0 px-3 py-2">{s.screenSetId}</a>
                    {/each}
                </VerticalScrollView>
            </div>
        </div>

        <div class="tile">
            <div class="params tile is-vertical mr-3">
                <Card title="Params" collapsable={true} bind:open={showParams} on:collapse={(e) => showEvents = !e.detail.open}>
                    <ScreenSetParams bind:params />
                </Card>
                <Card title="Events" collapsable={true} bind:open={showEvents} on:collapse={(e) => showParams = !e.detail.open}>
                    <ScreenSetEvents bind:events />
                </Card>
            </div>
            <div class="tile is-vertical">
                <div class="tile mb-3 is-flex-grow-0 is-flex-basis-auto">
                    <div class="tile is-flex screens">
                        <VerticalScrollView>
                            {#each currentScreenSet.screens as s, i}
                                <a href
                                   class:is-active={s === currentScreenSet.selectedScreen}
                                   on:click|preventDefault={() => {currentScreenSet.selectedScreen = s; showScreenSet()} }
                                   class="is-flex-shrink-0 px-3 py-2">{s}</a>
                            {/each}
                        </VerticalScrollView>
                    </div>
                </div>
                <Box class="tile is-flex is-flex-direction-column">
                    <ScreenSetView params={screenSetParams} />
                </Box>
            </div>
        </div>
    {:else }
        <ScreenSetsPageSkeleton />
    {/if}
</PageContent>

<style lang="scss">
  @import "bulma/sass/utilities/derived-variables";
  @import "src/client/mixin";
  @import "src/client/variables";
  .screen-sets, .screens {
    word-break: break-word;
    background-color: white;
    border-radius: 24px;
    box-shadow: $box-shadow;
    margin-right: -4px;
    overflow: hidden;
    border: 1px solid $link;

    a {
      border-radius: 20px;
      color: black;
      :not(:last-child) {
        margin-right: 4px;
      }


      &:hover {
        background-color: #ddd;
      }

      &.is-active {
        background-color: $link;
        color: white;
      }
    }
  }
  .screens {
    border: 1px solid $success;
    a.is-active {
      background-color: $success;
    }
  }
  .params {
    max-width: 500px;
  }
</style>
