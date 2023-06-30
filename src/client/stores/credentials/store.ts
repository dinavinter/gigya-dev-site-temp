import {Store} from '../store-base';
import {
    credentialCreated,
    credentialDeleted,
    credentialLoaded,
    credentialSelected,
    credentialUpdated
} from './actions';
import type {GigCredential} from './model';
import {findIndex} from 'lodash';

interface CredentialState {
    credentials: GigCredential[];
    selectedCredential: GigCredential;
}

export const credentialStore = new Store<CredentialState>({
    credentials: [],
    selectedCredential: null
});

credentialStore.on(credentialLoaded, (state, credentials) => {
    state.credentials = credentials;
    return state;
});
credentialStore.on(credentialCreated, (state, credential) => {
    state.credentials = [...state.credentials, credential];
    return state;
});
credentialStore.on(credentialDeleted, (state, credential) => {
    state.credentials = state.credentials.filter(c => c.userKey !== credential.userKey);
    return state;
});
credentialStore.on(credentialUpdated, (state, credential) => {
    const index = findIndex(state.credentials, (i) => i.userKey === credential.userKey);
    Object.assign(state.credentials[index], credential);
    return state;
});
credentialStore.on(credentialSelected, (state, creds) => {
    state.selectedCredential = creds;
    return state;
})

export const allCredentials = credentialStore.select(x => x.credentials);
export const selectedCredential = credentialStore.select(x => x.selectedCredential);