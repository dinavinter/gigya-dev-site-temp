import {createEffect} from '../store-base';
import {credentialSelected} from '../credentials';
import {
    createRunConfiguration,
    deleteRunConfiguration,
    effectiveSitesLoaded,
    loadRunConfiguration, loadUserSites,
    runConfigurationCreated,
    runConfigurationDeleted,
    runConfigurationLoaded,
    runConfigurationSaved, runSite,
    saveRunConfiguration,
    selectConfiguration
} from './actions';
import {http} from '../../utils/httpService';
import {showErrorToast, showSuccessToast} from '../toasts/actions';
import {siteConfigurations} from "./store";

const ADMIN_URL = '/admin'
const SITE_RUN_URL = '/site-run';

createEffect(credentialSelected, [], async () => {
    return [loadUserSites(), loadRunConfiguration()];
});

createEffect(loadUserSites, [], async () => {
    const result = await http.get(`${ADMIN_URL}/user-sites`)
    return effectiveSitesLoaded(result.sites);
});

createEffect(loadRunConfiguration, [], async () => {
    const result = await http.get(`${SITE_RUN_URL}`)
    return runConfigurationLoaded(result.configurations);
});

createEffect(createRunConfiguration, [], async (config) => {
    const result = await http.post(SITE_RUN_URL, config);
    if (result.success) {
        return [
            showSuccessToast({message: 'Run configuration saved successfully'}),
            runConfigurationCreated(config),
            selectConfiguration(config)
        ];
    } else {
        return showErrorToast({message: `Error saving run configuration: ${result.error}`});
    }
});

createEffect(saveRunConfiguration, [], async (config) => {
    const result = await http.put(SITE_RUN_URL, config);
    if (result.success) {
        return [
            showSuccessToast({message: 'Run configuration saved successfully'}),
            runConfigurationSaved(config)
        ];
    } else {
        return showErrorToast({message: `Error saving run configuration: ${result.error}`});
    }
});

createEffect(deleteRunConfiguration, [], async (config) => {
    const result = await http.delete(`${SITE_RUN_URL}/${config.id}`);
    if (result.success) {
        return [
            showSuccessToast({message: 'Run configuration deleted successfully'}),
            runConfigurationDeleted(config),
            selectConfiguration(null)
        ];
    } else {
        return showErrorToast({message: `Error deleting run configuration: ${result.error}`});
    }
});

createEffect(runSite, [siteConfigurations], (props, runConfigs) => {
    const conf = runConfigs.filter(x => !!x.sites.filter(y => y.apiKey === props.apiKey).length)[0];
    http.get(`${SITE_RUN_URL}/select`, {
        apiKey: props.apiKey,
        runId: conf.id
    });
    return [];
})