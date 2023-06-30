import type {Envs} from './types';
import {DC} from '../stores/site-settings';

export const tags = [
    'sso', 'child', 'parent', 'captcha', 'saml', 'idp', 'op', 'oidc', 'rp',
    'sp', 'pending-reg', '2fa'
] as const;

export const getGigyaDomain = (dc: DC, env: Envs = 'prod'): string =>  {
    if (dc === DC.CN) {
        return env === 'prod' ?
            `${dc}.sapcdm.cn` :
            `${dc}-${env}.${dc}.sapcdm.cn`
    }
    return `${dc}${env !== 'prod' ? `-${env}` : ''}.gigya.com`;
}

export const borderRadius = '1.2rem';