<script lang="ts">
    import {mdiArrowCollapseDown, mdiArrowCollapseUp, mdiClose} from "@mdi/js";
    import Icon from "../common/Icon.svelte";
    import EventItem from "./EventItem.svelte";
    import type {GigyaEvent} from "../../stores/gigya";
    import {gigEvents, isGigyaServiceReady} from "../../stores/gigya";
    import {JsonView} from "@zerodevx/svelte-json-view";
    import {clickOutside} from '../../utils/clickOutside';
    import {debounce} from 'lodash';

    let showEvents = false;
    let showEventDetails = false;
    let eventDetails: any = null;
    let blinkEvent = false;

    function showDetails(event: GigyaEvent) {
        eventDetails = event.details
        showEventDetails = true
    }

    function hideDetails() {
        eventDetails = null
        showEventDetails = false
    }

    function toggleEvents() {
        showEvents = !showEvents;
        !showEvents && hideDetails();
    }

    function hideEvent() {
        showEvents = false;
        hideDetails();
    }

    const toggleBlink = debounce(() => blinkEvent = false, 250)

    gigEvents.subscribe((events) => {
        blinkEvent = true;
        toggleBlink();
    })

</script>
{#if isGigyaServiceReady}
    <div class="is-relative" use:clickOutside on:clickoutside={hideEvent}>
        <a href class="first-event is-flex is-justify-content-space-between is-align-items-center" class:blink={blinkEvent} on:click|preventDefault={toggleEvents}>
            <EventItem event={$gigEvents[0]} />
            <button>
                <Icon path={showEvents ? mdiArrowCollapseUp : mdiArrowCollapseDown} size={.7} />
            </button>
        </a>
        <div class="events">
            <div class="all-events" class:hide={!showEvents}>
                <div class="px-3 py-2">
                    {#each $gigEvents as e, index (index)}
                        <EventItem event={e} on:click={() => showDetails(e)} />
                    {/each}
                </div>
            </div>
            <div class="event-details" class:show={!showEventDetails} use:clickOutside on:clickoutside={hideDetails}>
                <div class="px-3 py-2">
                    <JsonView json={eventDetails} depth={0} />
                </div>
                <button class="close" on:click={hideDetails}>
                    <Icon path={mdiClose} size={.8} />
                </button>
            </div>
        </div>
    </div>
{/if}


<style lang="scss">
  @import "bulma/sass/utilities/derived-variables";
  @import "src/client/mixin";
  @import "src/client/variables";
  .events {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 9;
  }
  .event-details {
    @include scroll-bar();
    position: relative;
    border-radius: $default-radius;
    bottom: 320px;
    left: -355px;
    width: 350px;
    height: 320px;
    font-size: 12px;
    background-color: rgba(255, 255, 255, 1);
    transition-property: width, height, left, bottom;
    transition-duration: .2s;
    transition-timing-function: ease-in-out;
    box-shadow: $box-shadow;

    .close {
      position: absolute;
      right: 6px;
      top: 12px;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }

    &.show {
      width: 0;
      height: 0;
      bottom: 0;
      left: -5px;
    }
  }
  .first-event {
    height: 100%;
    width: 500px;
    color: black;
    border-radius: $default-radius;
    padding: .3rem 1rem;
    cursor: pointer;
    transition: background-color .2s ease-in-out;

    &.blink {
      background-color: rgba(0, 0, 0, .1);
    }

    button {
      background-color: transparent;
      border: none;
      padding: 0 6px;
    }
  }

  .all-events {
    @include scroll-bar();
    margin-top: 8px;
    border-radius: $default-radius;
    height: 500px;
    transition: height .2s ease-in-out;
    background-color: rgba(255, 255, 255, 1);
    box-shadow: $box-shadow;
    left: 0;
    right: 0;

    &.hide {
      height: 0;
    }
  }
  :global(.event-details .number) {
    display: inline-block;
    font-size: inherit;
    margin: 0;
    padding: 0;
    background-color: transparent;
    min-width: 0;
    height: inherit;
  }
  :global(.event-details ._jsonList) {
    color: $dark;
  }
</style>
