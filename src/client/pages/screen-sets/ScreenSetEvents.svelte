<script lang="ts">
    import ParamCard from "./ParamCard.svelte";
    import Select from "../../components/forms/Select.svelte";
    import SelectItem from "../../components/forms/SelectItem.svelte";
    import {toastStore} from '../../stores/toasts/store';
    import {showInfoToast} from '../../stores/toasts/actions';

    export let events = {};

    const screenEvents = {
        onError: 'toast',
        onBeforeScreenLoad: 'console',
        onAfterScreenLoad: 'console',
        onFieldChanged: 'console',
        onBeforeValidation: 'console',
        onBeforeSubmit: 'console',
        onSubmit: 'console',
        onAfterSubmit: 'console',
        onHide: 'console',
    };
    const eventsOn = Object.keys(screenEvents).reduce((ons, e) => {
        ons[e] = e === 'onError';
        return ons;
    }, {});

    function updateEvents(screenEvents, isOn) {
        events = Object.keys(screenEvents).reduce((events, e) => {
            if (isOn[e]) {
                events[e] = (res) => {
                    if (screenEvents[e] === 'toast') {
                        toastStore.dispatch(showInfoToast({
                            message: 'Screen Set event: ' + e,
                            timeout: 5000
                        }));
                    }
                    else if (screenEvents[e] === 'console') {
                        console.log(res)
                    }
                    else if (screenEvents[e] === 'debugger') {
                        debugger
                    }
                };
            }
            return events;
        }, {});
    }

    $: updateEvents(screenEvents, eventsOn)
</script>


<div class="columns is-multiline p-2 is-variable is-2">
    {#each Object.keys(screenEvents) as e}
        <span class="column is-half">
            <ParamCard title={e} bind:isOn={eventsOn[e]}>
                <Select bind:value={screenEvents[e]} disabled={!eventsOn[e]}>
                    <SelectItem value="toast">Toast</SelectItem>
                    <SelectItem value="console">Console</SelectItem>
                    <SelectItem value="debugger">Debugger</SelectItem>
                </Select>
            </ParamCard>
        </span>
    {/each}
</div>