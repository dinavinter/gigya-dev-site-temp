import {createSelector, Store} from '../store-base';
import type {SiteSettings} from './model';
import {siteSettingsLoaded, siteSettingsUpdated} from './actions';

export const siteSettingsStore = new Store<SiteSettings>({
    dc: null,
    env: null,
    apiKey: null,
    version: null,
    defaultScreenSetId: null,
    oidcProviders: [],
    samlProviders: []
});

siteSettingsStore.on(siteSettingsLoaded, (state, siteSettings) => siteSettings);
siteSettingsStore.on(siteSettingsUpdated, (state, props) => {
    return {
        ...state,
        ...props
    };
});

export const siteSettings = siteSettingsStore.select(x => x);
export const currentDc = createSelector(siteSettings, (s) => s?.dc );
export const currentEnv = createSelector(siteSettings, (s) => s?.env);
export const currentApiKey = createSelector(siteSettings, (s) => s?.apiKey);