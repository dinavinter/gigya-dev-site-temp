import {mdiAccountEditOutline, mdiCloudLockOutline, mdiLogin, mdiLogout} from '@mdi/js';
import Login from './Login.svelte';
import {toastStore} from '../../../stores/toasts/store';
import {showWarningToast} from '../../../stores/toasts/actions';
import {navigate} from 'svelte-navigator';


class Flow {
    label: string;
    icon: string;
    exec?: () => void;
}

export const flows: Flow[] = [
    {
        label: 'Login',
        icon: mdiLogin,
        exec: () => {
            navigate('/login')
        }
    }, {
        label: 'SSO Login (popup)',
        icon: mdiCloudLockOutline,
        exec: () => {
            if (window.gigya.partnerSettings.ssoKey) {
                window.gigya.sso.login();
            } else {
                toastStore.dispatch(showWarningToast({
                    message: 'Site is not in SSO group'
                }))
            }
        }
    }, {
        label: 'SSO Login (redirect)',
        icon: mdiCloudLockOutline,
        exec: () => {
            if (window.gigya.partnerSettings.ssoKey) {
                window.gigya.sso.login({
                    authFlow: 'redirect'
                });
            } else {
                toastStore.dispatch(showWarningToast({
                    message: 'Site is not in SSO group'
                }))
            }
        }
    }, {
        label: 'Profile Update',
        icon: mdiAccountEditOutline,
        exec: () => {
            navigate('/update-profile')
        }
    }, {
        label: 'Logout',
        icon: mdiLogout,
        exec: () => {
            window.gigya.accounts.logout();
        }
    }
]
