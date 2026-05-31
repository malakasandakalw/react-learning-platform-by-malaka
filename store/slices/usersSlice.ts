import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getUsers, getUser } from "@/services/jsonPlaceholder";
import type { User } from "@/types/user";

type UsersState = {
  list: User[];
  selected: User | null;
  loading: boolean;
  error: string | null;
};

const initialState: UsersState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  return getUsers();
});

export const fetchUser = createAsyncThunk("users/fetchOne", async (id: number) => {
  return getUser(id);
});

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    selectUser: (state, action: PayloadAction<User>) => {
      state.selected = action.payload;
    },
    clearSelected: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch users";
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch user";
      });
  },
});

export const { selectUser, clearSelected } = usersSlice.actions;
export default usersSlice.reducer;
