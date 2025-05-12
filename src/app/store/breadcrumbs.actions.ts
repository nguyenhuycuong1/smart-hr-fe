import { createAction, props } from '@ngrx/store';
import { Breadcrumb } from '../shared/models';

export const updateBreadcrumb = createAction(
  '[UPDATE] Update Breadcrumbs',
  props<{ breadcrumbs: Breadcrumb[] }>()
);
