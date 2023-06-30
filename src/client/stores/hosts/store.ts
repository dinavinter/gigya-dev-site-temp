import {Store} from '../store-base';
import type {HostItem} from './model';
import {hostsCreated, hostsDeleted, hostsLoaded, hostsUpdated} from './actions';
import {findIndex} from 'lodash';

export const hostsStore = new Store<HostItem[]>([]);

hostsStore.on(hostsLoaded, (state, hosts) => hosts);
hostsStore.on(hostsCreated, (state, host) => [...state, host]);
hostsStore.on(hostsUpdated, (state, host) => {
    const index = findIndex(state, (i) => i.hosts === host.hosts);
    Object.assign(state[index], host);
    return state;
});
hostsStore.on(hostsDeleted, (state, host) => {
    return state.filter((i) => i.hosts !== host.hosts);
});

export const allHosts = hostsStore.select(x => x);