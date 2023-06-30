import {siteSettingsStore} from './store';
import {loadSiteSettings} from './actions';

export * from './model';
export * from './actions';
export * from './store';
export * from './effects';

siteSettingsStore.dispatch(loadSiteSettings());