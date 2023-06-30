import {Store} from '../store-base';
import {
    gigyaServiceReady,
    loginEvent,
    logoutEvent,
    newEvent,
    reloadScript,
    screenSetLoaded, sdkVersionUpdated
} from './actions';
import type {GigyaState, GigyaEvent} from './models';

export const gigStore = new Store<GigyaState>({
    isGigyaServiceReady: false,
    reload: true,
    screenSets: [],
    events: null,
    hasSession: false,
    sdkVersion: []
});

gigStore.on(reloadScript, (state) => {
    state.reload = true;
    state.isGigyaServiceReady = false;
    state.screenSets = [];
    return state;
});

gigStore.on(gigyaServiceReady, (state) => {
    state.reload = false;
    state.isGigyaServiceReady = true;
    return state;
});

gigStore.on(screenSetLoaded, (state, screenSets) => {
    state.screenSets = screenSets;
    return state;
});

gigStore.on(sdkVersionUpdated, (state, version) => {
    state.sdkVersion = version;
    return state;
});

gigStore.on(loginEvent, (state, response) => {
    state.events = {
        type: 'login',
        details: response?.details
    };
    state.hasSession = true;
    return state;
});

gigStore.on(logoutEvent, (state, response) => {
    state.events = {
        type: 'logout',
        details: response?.details
    };
    state.hasSession = false;
    return state;
});

export const gigState = gigStore.select(x => x);
export const isGigyaServiceReady = gigStore.select(x => x.isGigyaServiceReady);
export const screenSets = gigStore.select(x => x.screenSets)
export const hasSession = gigStore.select(x => x.hasSession)
export const sdkVersions = gigStore.select(x => x.sdkVersion)
export const events = gigStore.select(x => x.events)

export const gigEventsStore = new Store<GigyaEvent[]>([]);
gigEventsStore.on(newEvent, (state, event) => {
    state.unshift(event);
    return state;
});

export const gigEvents = gigEventsStore.select(x => x)
