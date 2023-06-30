import {createEffect} from '../store-base';
import {
    errorEvent,
    gigyaServiceReady,
    loginEvent,
    logoutEvent,
    newEvent, reloadScript,
    screenSetLoaded, sdkVersionUpdated
} from './actions';
import {promisify} from '../../utils/promisify';
import type {ScreenSet} from './models';
import {gigEventsStore, gigStore} from './store';
import {showErrorToast, showInfoToast} from '../toasts/actions';
import {siteSettings, siteSettingsUpdated} from '../site-settings';
import {http} from '../../utils/httpService';

function addEventMapHandler() {
    gigya.defaultEventMaps.push({
        id: 'gig-events',
        defaultMethod: e => {
            gigEventsStore.dispatch(newEvent({
                timestamp: Date.now(),
                eventName: e.eventName,
                details: e
            }));
        },
        eventMap: [{events: '*', args: [e => e]}]
    });
}

async function getScreenSets() {
    const screenSets: ScreenSet[] = [];
    const result = await promisify(gigya.accounts.getScreenSets, {
        include: 'html,screenSetID'
    });
    let template = document.createElement('div');
    for (const s of result.screenSets) {
        template.innerHTML = s.html;
        screenSets.push({
            screenSetId: s.screenSetID,
            screens: [...template.querySelectorAll('.gigya-screen')].map(x => x.id)
        });
    }
    return screenSets;
}

async function getSDKVersion() {
    const result = await http.get(`/admin/sdk-versions`);
    return result.versions;
}

function registerGlobalEvents() {
    window.gigya.accounts.addEventHandlers({
        onLogin: (res) => gigStore.dispatch(loginEvent(res)),
        onLogout: (res) => gigStore.dispatch(logoutEvent(res)),
        onError: (res) => gigStore.dispatch(errorEvent(res)),
    });
}

createEffect(siteSettingsUpdated, [], () => reloadScript());

createEffect(gigyaServiceReady, [siteSettings], async (props, siteSettings) => {
    addEventMapHandler();
    registerGlobalEvents();
    const screenSets = await getScreenSets();
    const sdkVersions = await getSDKVersion();
    const isLoggedIn = await gigya.hasSession();

    return [
        isLoggedIn ? loginEvent() : logoutEvent(),
        screenSetLoaded(screenSets),
        sdkVersionUpdated(sdkVersions)
    ];
});

createEffect(loginEvent, [], async () => {
    return [
        showInfoToast({
            message: 'User is logged in'
        })
    ];
})

createEffect(logoutEvent, [], async () => {
    return [
        showInfoToast({
            message: 'User is logged out'
        })
    ];
})

createEffect(errorEvent, [], async ({details}) => {
    return [
        showErrorToast({
            message: details?.errorMessage || 'Unknown error'
        })
    ];
})