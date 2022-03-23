import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface PlayerHudState {
  value: boolean;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: PlayerHudState = {
  value: true,
  status: 'idle',
};

export const playerHudSlice = createSlice({
  name: 'playerHud',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    toggle: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.value = !state.value;
    },
    setState: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { toggle } = playerHudSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectState = (state: RootState) => state.playerHud.value;

export default playerHudSlice.reducer;
