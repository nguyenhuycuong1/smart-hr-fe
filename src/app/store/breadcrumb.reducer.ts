import { createReducer, on } from '@ngrx/store';
import { updateBreadcrumb } from './breadcrumbs.actions';
import { Breadcrumb } from '../shared/models';

export const initialState: Breadcrumb[] = [];

export const breadcrumbReducer = createReducer(
  initialState,
  on(updateBreadcrumb, (state, { breadcrumbs }) => [...breadcrumbs])
);
