import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import drawerReducer from './layout/drawerSlice';

export const store = configureStore({
  reducer: {
    drawer: drawerReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
