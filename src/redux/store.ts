import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import drawerReducer from './layout/drawerSlice';
import modalReducer from './layout/modalSlice';
import startGameReducer from './game/startGameSlice';

export const store = configureStore({
  reducer: {
    syncState: startGameReducer,
    drawer: drawerReducer,
    modal: modalReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
