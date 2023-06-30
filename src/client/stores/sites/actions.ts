import {createAction, props} from '../store-base';
import type {GigSite, RunConfiguration} from './model';

export const effectiveSitesLoaded = createAction('[Sites] effective sites loaded', props<GigSite[]>());
export const loadRunConfiguration = createAction('[Sites] load run configs');
export const loadUserSites = createAction('[Sites] load user sites');
export const runConfigurationLoaded = createAction('[Sites] site configLoaded', props<RunConfiguration[]>());
export const createRunConfiguration = createAction('[Sites] create config', props<RunConfiguration>());
export const runConfigurationCreated = createAction('[Sites] config created', props<RunConfiguration>());
export const deleteRunConfiguration = createAction('[Sites] delete config', props<RunConfiguration>());
export const runConfigurationDeleted = createAction('[Sites] config deleted', props<RunConfiguration>());
export const saveRunConfiguration = createAction('[Sites] save config', props<RunConfiguration>());
export const runConfigurationSaved = createAction('[Sites] config saved', props<RunConfiguration>());
export const selectConfiguration = createAction('[Sites] select config', props<RunConfiguration>());
export const runSite = createAction('[Sites] run site', props<{ apiKey: string }>());
