<script lang="ts">
    import type {GigyaEvent} from '../../stores/gigya';

    export let event: GigyaEvent;

    function getTime(timestamp: number) {
        const date = new Date(timestamp);
        const h = date.getHours();
        const m = date.getMinutes().toString().padStart(2, '0');
        const s = date.getSeconds().toString().padStart(2, '0');
        const ms = date.getMilliseconds().toString().padEnd(3, '0');
        return `${h}:${m}:${s}.${ms}`
    }

    function getEventDetails() {
        switch (event.eventName) {
            case 'beforePluginLoad':
            case 'login':
            case 'logout':
            case 'load': return ` event fired (source=${event.details.source})`;
            case 'beforeScreenLoad':
            case 'afterScreenLoad':
            case 'hide': return ` screen-set (${event.details.screenSetID})`;
            case 'fieldChanged': return ` ${event.details.field}=${event.details.value}`;
            case 'beforeRequest': return ` calling '${event.details.methodName}'`;
            case 'afterResponse': return ` response from '${event.details.methodName}' (${event.details.response.errorCode})`;
            case 'beforePluginRequest': return ` event fired (source=${event.details.methodName})`;
            default: return '';
        }
    }
</script>

{#if event}
    <div class="event is-flex is-align-items-center is-size-7">
        <div class="has-text-grey is-size-6">[<span class="is-size-7">{getTime(event?.timestamp)}</span>]</div>&nbsp;-&nbsp;
        <div class="event-details">
            <a href on:click|preventDefault class="event-name {event.eventName}">{event.eventName}</a>
            {getEventDetails()}
        </div>
    </div>
{:else}
    NA
{/if}

<style lang="scss">
    @import "../../../../node_modules/bulma/sass/utilities/derived-variables";
    .event {
      max-width: 90%;
      color: black;
    }
    .event-details {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .event-name {
      cursor: pointer;
      text-decoration: underline;
      font-weight: bolder;
    }
    .load, .hide, .beforeScreenLoad, .afterScreenLoad, .fieldChanged {
      color: $warning-dark;
    }
    .afterResponse, .beforeRequest {
      color: $danger-dark;
    }
    .beforePluginRequest, .beforePluginLoad, .onRefreshExternalComponentsEvent {
      color: $info;
    }
    .login, .logout {
      color: $success;
    }
</style>