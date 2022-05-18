import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface ModalState {
  isOpen: boolean;
  modalWindow: 'login' | 'register' | 'reset' | 'tokenEntry' | 'lobbyConfirmation' | 'gameRoundConclusion' | 'gameConclusion'
}

const initialState: ModalState = {
  isOpen: false,
  modalWindow: 'login'
};

export const modalSlice = createSlice({
  name: 'modal',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    toggle: (state, window: PayloadAction<ModalState['modalWindow']>) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.isOpen = !state.isOpen;
      state.modalWindow = window.payload;
    },
    setState: (state, action: PayloadAction<ModalState>) => {
      state.isOpen = action.payload.isOpen;
      state.modalWindow = action.payload.modalWindow;
    },
  },
});

export const { toggle, setState } = modalSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectState = (state: RootState) => state.modal;

export default modalSlice.reducer;