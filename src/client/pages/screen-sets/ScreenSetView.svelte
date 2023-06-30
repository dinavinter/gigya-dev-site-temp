<script lang="ts">
    import {uid} from '../../utils/unique-id-generator';
    import {onMount} from 'svelte';

    export let params: any;
    let containerID = uid();
    let isShown = false;
    let isMounted = false;

    function showScreenSet(params: any) {
        if (isShown || !params) {
            window.gigya.accounts.hideScreenSet({
                containerID
            });
            isShown = false;
        }
        if (!params) return;


        if (params.mode === 'inline') {
            params.containerID = containerID;
        } else {
            delete params.containerID;
        }

        const {mode, ...restParams} = params;
        window.gigya.accounts.showScreenSet({
            ...restParams,
            callback: (res) => {
                if (res.errorCode !== 0) {
                    isShown = true;
                }
            }
        });
    }

    onMount(() => {
        isMounted = true;
    })

    $: if (isMounted) showScreenSet(params || null);
</script>

<div id={containerID}></div>
