import {createAction, props} from '../store-base';
import type {HostItem} from './model';

export const loadHosts = createAction("[Hosts] load from server");
export const hostsLoaded = createAction("[Hosts] loaded", props<HostItem[]>());
export const syncHosts = createAction("[Hosts] sync");
export const createHosts = createAction("[Hosts] create", props<HostItem>())
export const hostsCreated = createAction("[Hosts] hosts created", props<HostItem>());
export const updateHosts = createAction("[Hosts] update", props<HostItem>())
export const hostsUpdated = createAction("[Hosts] hosts updated", props<HostItem>());
export const deleteHosts = createAction("[Hosts] delete", props<HostItem>())
export const hostsDeleted = createAction("[Hosts] hosts deleted", props<HostItem>());