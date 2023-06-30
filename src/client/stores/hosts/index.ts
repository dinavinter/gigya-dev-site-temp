import {hostsStore} from './store';
import {loadHosts} from './actions';

export * from './store';
export * from './actions';
export * from './effects';
export * from './model';

hostsStore.dispatch(loadHosts());