import {createAction, props} from '../store-base';
import type {DC, Envs, SiteSettings} from './model';

export const loadSiteSettings = createAction("[Site Settings] load from server");
export const siteSettingsLoaded = createAction("[Site Settings] loaded", props<SiteSettings>());
export const updateDC = createAction("[Site Settings] update DC", props<{dc: DC}>());
export const updateEnv = createAction("[Site Settings] update env", props<{env: Envs}>());
export const updateVersion = createAction("[Site Settings] update version", props<{version: string}>());
export const siteSettingsUpdated = createAction("[Site Settings] updated", props<SiteSettings>());