import {createEffect} from '../store-base';
import {
    credentialCreated, createCredential, credentialLoaded, loadCredentials,
    updateCredential, credentialUpdated, deleteCredential, credentialDeleted, selectCredential, credentialSelected
} from './actions';
import {http} from '../../utils/httpService';
import {showErrorToast, showSuccessToast} from '../toasts/actions';
import {allCredentials, selectedCredential} from './store';
import {currentDc} from '../site-settings';

const ENDPOINT = '/credential';

createEffect(loadCredentials, [], async () => {
    const result = await http.get(ENDPOINT);
    return credentialLoaded(result.credentials || []);
});

createEffect(credentialLoaded, [currentDc], (creds, dc) => {
    return selectCredential({dc});
});

createEffect(createCredential, [], async (credential) => {
    const result = await http.post(ENDPOINT, credential);
    if (result.success) {
        return [
            showSuccessToast({message: 'Credential saved successfully'}),
            credentialCreated(credential)
        ];
    } else {
        return showErrorToast({message: `Error saving credential: ${result.error}`});
    }
});

createEffect(updateCredential, [], async (credential) => {
    const result = await http.put(ENDPOINT, credential);
    if (result.success) {
        return [
            showSuccessToast({message: 'Credential update successfully'}),
            credentialUpdated(credential)
        ];
    } else {
        return showErrorToast({message: `Error update credential: ${result.error}`});
    }
});

createEffect(deleteCredential, [], async (credential) => {
    const result = await http.delete(`${ENDPOINT}/${credential.userKey}`);
    if (result.success) {
        return [
            showSuccessToast({message: 'Credential deleted successfully'}),
            credentialDeleted(credential)
        ];
    } else {
        return showErrorToast({message: `Error deleted credential: ${result.error}`});
    }
});

createEffect(selectCredential, [allCredentials, selectedCredential], ({dc}, credentials, currentCred) => {
    const effectiveDc = dc === 'us1' || dc === 'eu1' || dc === 'au1' ? 'us1' : dc;
    if (currentCred && (currentCred.dc === effectiveDc)) {
        return [];
    }

    const creds = credentials.filter(x => x.dc === effectiveDc)[0];
    if (creds) {
        return credentialSelected(creds);
    }
    return [];
})