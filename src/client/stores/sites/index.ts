import {siteStore} from './store';
import {loadRunConfiguration} from './actions';

export * from './store';
export * from './actions';
export * from './effects';
export * from './model';


siteStore.dispatch(loadRunConfiguration());