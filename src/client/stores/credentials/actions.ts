import {createAction, props} from '../store-base';
import type {GigCredential} from './model';
import type {DC} from '../site-settings';

export const loadCredentials = createAction("[Credentials] load from server");
export const credentialLoaded = createAction("[Credentials] loaded", props<GigCredential[]>());
export const createCredential = createAction("[Credentials] create", props<GigCredential>())
export const credentialCreated = createAction("[Credentials] credential created", props<GigCredential>());
export const updateCredential = createAction("[Credentials] update", props<GigCredential>())
export const credentialUpdated = createAction("[Credentials] credential updated", props<GigCredential>());
export const deleteCredential = createAction("[Credentials] delete", props<GigCredential>())
export const credentialDeleted = createAction("[Credentials] credential deleted", props<GigCredential>());
export const selectCredential = createAction("[Credentials] select credential", props<{ dc: DC }>());
export const credentialSelected = createAction("[Credentials] credential selected", props<GigCredential>());