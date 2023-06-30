import {Store} from '../store-base';
import type {GigSite, RunConfiguration, SiteRunConfiguration} from './model';
import {
    effectiveSitesLoaded,
    createRunConfiguration,
    selectConfiguration,
    runConfigurationLoaded, runConfigurationDeleted, runConfigurationSaved
} from './actions';
import {findIndex} from 'lodash';

interface SiteState {
    effectiveSites: GigSite[];
    configurations: RunConfiguration[];
    selectedConfiguration: RunConfiguration;
}

export const siteStore = new Store<SiteState>({
    effectiveSites: [],
    configurations: [],
    selectedConfiguration: null
});

siteStore.on(effectiveSitesLoaded, (state, sites) => {
    state.effectiveSites = sites ?? [];
    return state;
});

siteStore.on(runConfigurationLoaded, (state, configs) => {
    state.configurations = configs;
    state.selectedConfiguration = configs[0] ?? null;
    return state;
})

siteStore.on(createRunConfiguration, (state, config) => {
    state.configurations.push(config);
    return state;
});

siteStore.on(runConfigurationSaved, (state, config) => {
    const index = findIndex(state.configurations, x => x.id === config.id);
    if (index > 0) {
        Object.assign(state.configurations[index], config);
    }
    return state;
});

siteStore.on(runConfigurationDeleted, (state, config) => {
    state.configurations = state.configurations.filter(x => x.id !== config.id);
    return state;
});

siteStore.on(selectConfiguration, (state, config) => {
    state.selectedConfiguration = config;
    return state;
});

export const effectiveSites = siteStore.select(x => x.effectiveSites);
export const siteConfigurations = siteStore.select(x => x.configurations)
export const selectedConfiguration = siteStore.select(x => x.selectedConfiguration)
export const allSites = siteStore.select(x => {
    let allSites: SiteRunConfiguration[] = [];
    for (const conf of x.configurations) {
        allSites = [
            ...allSites,
            ...conf.sites
        ] ;
    }
    return allSites;
})