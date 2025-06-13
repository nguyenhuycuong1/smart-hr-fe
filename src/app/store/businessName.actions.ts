import { createAction, props } from '@ngrx/store';

export const updateBusinessName = createAction(
  '[Business Name] Update',
  props<{ businessName: string }>(),
);
