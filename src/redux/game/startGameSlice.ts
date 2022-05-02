import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface SyncState {
  syncing: boolean;
}

const initialState: SyncState = {
  syncing: true,
};

export const startGameSlice = createSlice({
  name: 'gameSync',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setState: (state, action: PayloadAction<boolean>) => {
      state.syncing = action.payload;
    },
  },
});

export const { setState } = startGameSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectState = (state: RootState) => state.syncState.syncing;

export default startGameSlice.reducer;
