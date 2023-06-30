import type {Action} from './model';
import {navigate} from 'svelte-navigator';
import {siteSettingsStore, updateDC, updateEnv, updateVersion} from '../../../stores/site-settings';
import {get} from 'svelte/store';
import {allSites, runSite, siteStore} from '../../../stores/sites';
import {actionStore, setChildActions} from '../action-store';
import {http} from '../../../utils/httpService';
import {gigStore, reloadScript, screenSets, sdkVersions} from '../../../stores/gigya';
import {toastStore} from '../../../stores/toasts/store';
import {showInfoToast} from '../../../stores/toasts/actions';

export const actions: Action[] = [{
        id: 'set-dc',
        label: 'Set DC',
        children: [
            ...['us1', 'eu1', 'au1', 'cn1', 'eu2', 'il3']
                .map((dc: any) => {
                    return {
                        id: `dc-${dc}`,
                        label: dc.toUpperCase(),
                        exec: () => {
                            siteSettingsStore.dispatch(updateDC({dc: dc.toLowerCase()}));
                            return true;
                        }
                    } as Action
                })
        ]
    }, {
        id: 'set-env',
        label: 'Set Environment',
        children: [
            ...['Prod', 'ST1', 'ST2', 'ST7']
                .map((env: any) => {
                    return {
                        id: `dc-${env.toLowerCase()}`,
                        label: env,
                        exec: () => {
                            siteSettingsStore.dispatch(updateEnv({env: env.toLowerCase()}));
                            return true;
                        }
                    } as Action
                })
        ]
    }, {
        id: 'set-sdk-version',
        label: 'Set SDK Version',
        exec: () => {
            const actions = get(sdkVersions).map(s => {
                return {
                    id: `${s.version}`,
                    label: s.version,
                    exec: () => {
                        siteSettingsStore.dispatch(updateVersion({version: s.version}));
                        return true;
                    }
                } as Action;
            });
            actionStore.dispatch(setChildActions(actions));
            return false;
        }
    }, {
        id: 'goto',
        label: 'Goto',
        children: [
            ...[
                { label: 'Home', url: ''},
                { label: 'Screen Sets', url: 'screen-sets'},
                { label: 'Sites', url: 'sites'},
                { label: 'Settings', url: 'settings'}
            ].map(({label, url}) => {
                return {
                    id: `goto-${label.toLowerCase()}`,
                    label,
                    exec: () => {
                        navigate(`/${url}`);
                        return true;
                    }
                } as Action
            })
        ]
    }, {
        id: 'run-site',
        label: 'Run Site',
        exec: () => {
            const actions = get(allSites).map(s => {
                return {
                    id: `${s.siteId}`,
                    label: s.baseDomain,
                    exec: () => {
                        siteStore.dispatch(runSite({
                            apiKey: s.apiKey
                        }));
                        return true;
                    }
                } as Action;
            });
            actionStore.dispatch(setChildActions(actions));
            return false;
        }
    }, {
        id: 'show-screen-set',
        label: 'Show Screen Set',
        exec: () => {
            const screens = get(screenSets).map(({screenSetId: screenSet, screens}) => {
                return {
                    id: `${screenSet}`,
                    label: screenSet,
                    children: screens.map(startScreen => {
                        return {
                            id: startScreen,
                            label: startScreen,
                            exec: () => {
                                gigya.accounts.showScreenSet({
                                    screenSet,
                                    startScreen
                                });
                                return true;
                            }
                        }
                    })
                } as Action;
            });
            actionStore.dispatch(setChildActions(screens));
            return false;
        }
    }, {
        id: 'reload-gigya',
        label: 'Reload Gigya Script',
        exec: () => {
            toastStore.dispatch(showInfoToast({message: 'Reloading Gigya script'}));
            gigStore.dispatch(reloadScript());
            return true;
        }
    }, {
        id: 'logout',
        label: 'Logout',
        exec: () => {
            window.gigya.accounts.logout();
            return true;
        }
    }
]
