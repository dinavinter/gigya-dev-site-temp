import {createEffect} from '../store-base';
import {loadSiteSettings, siteSettingsLoaded, siteSettingsUpdated, updateDC, updateEnv, updateVersion} from './actions';
import {http} from '../../utils/httpService';
import {showErrorToast, showSuccessToast} from '../toasts/actions';
import {get} from 'svelte/store';
import {siteSettings} from './store';
import type {SiteSettings} from './model';
import {selectCredential} from '../credentials';
import {pick} from 'lodash';


async function updateSiteSettings(settings: SiteSettings) {
    const result = await http.post('/config', settings);
    if (result.success) {
        return [
            showSuccessToast({message: 'Site config saved successfully'}),
            siteSettingsUpdated(settings)
        ];
    } else {
        return [showErrorToast({message: result.error})];
    }
}

createEffect(loadSiteSettings, [], async () => {
    const result = await http.get('/config');
    if (result.success) {
        const creds = {
            dc: result.dc,
            env: result.env,
            apiKey: result.apiKey
        }
        return [
            siteSettingsLoaded(pick(result, ['dc', 'env', 'apiKey', 'version', 'oidcProviders', 'defaultScreenSetId', 'samlProviders'])),
            selectCredential(creds)
        ];
    }
    return showErrorToast(result.error);
})

createEffect(updateDC, [], async ({dc}) => {
    const cred = {...get(siteSettings), dc};
     return [
         ...await updateSiteSettings(cred),
        selectCredential(cred)
     ];
});

createEffect(updateEnv, [], async ({env}) => {
    const cred = {...get(siteSettings), env};
    return [
        ...await updateSiteSettings(cred),
        selectCredential(cred)
    ];
});

createEffect(updateVersion, [], async ({version}) => {
    const cred = {...get(siteSettings), version};
    return [
        ...await updateSiteSettings(cred),
        selectCredential(cred)
    ];
});