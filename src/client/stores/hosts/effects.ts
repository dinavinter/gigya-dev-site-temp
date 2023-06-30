import {createEffect} from '../store-base';
import {
    createHosts, deleteHosts, hostsCreated, hostsDeleted,
    hostsLoaded, hostsUpdated,
    loadHosts, syncHosts, updateHosts
} from './actions';
import {http} from '../../utils/httpService';
import {showErrorToast, showSuccessToast} from '../toasts/actions';

const ENDPOINT = '/hosts';

createEffect(loadHosts,  [],async () => {
    const result = await http.get(ENDPOINT);
    return hostsLoaded(result.hosts || []);
});


createEffect(syncHosts,  [],async () => {
    const result = await http.post(`${ENDPOINT}/sync`);
    if (result.success) {
        return [
            loadHosts(),
            showSuccessToast({message: 'Host file synced successfully'})
        ];
    } else {
        return showErrorToast({message: result.error});
    }
});

createEffect(createHosts,  [],async (host) => {
    const result = await http.post(`${ENDPOINT}`, host);
    if (result.success) {
        return [
            hostsCreated(host),
            showSuccessToast({message: 'Host created successfully'})
        ];
    } else {
        return showErrorToast({message: result.error});
    }
});

createEffect(updateHosts, [], async (host) => {
    const result = await http.put(`${ENDPOINT}`, host);
    if (result.success) {
        return [
            hostsUpdated(host),
            showSuccessToast({message: 'Host updated successfully'})
        ];
    } else {
        return showErrorToast({message: result.error});
    }
});

createEffect(deleteHosts, [], async (host) => {
    const result = await http.delete(`${ENDPOINT}/${host.id}`);
    if (result.success) {
        return [
            hostsDeleted(host),
            showSuccessToast({message: 'Host deleted successfully'})
        ];
    } else {
        return showErrorToast({message: result.error});
    }
});