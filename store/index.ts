import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./slices/counterSlice";
import usersReducer from "./slices/usersSlice";
import postsReducer from "./slices/postsSlice";
import cartReducer from "./slices/cartSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    users: usersReducer,
    posts: postsReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
