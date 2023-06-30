<script lang="ts">

    import {isGigyaServiceReady} from '../../../stores/gigya';

    $: $isGigyaServiceReady && console.log('Logging out!!!')
</script>
