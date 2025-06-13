import { createReducer, on } from '@ngrx/store';
import { updateBusinessName } from './businessName.actions';

export const initialState: string = '';

export const businessNameReducer = createReducer(
  initialState,
  on(updateBusinessName, (state, { businessName }) => businessName),
);
