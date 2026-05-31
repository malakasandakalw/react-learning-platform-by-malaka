import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { getPosts, createPost, deletePost } from "@/services/jsonPlaceholder";
import type { Post } from "@/types/post";

type PostsState = {
  list: Post[];
  loading: boolean;
  error: string | null;
};

const initialState: PostsState = {
  list: [],
  loading: false,
  error: null,
};

export const fetchPosts = createAsyncThunk("posts/fetchAll", async () => {
  return getPosts();
});

export const addPost = createAsyncThunk("posts/add", async (post: Omit<Post, "id">) => {
  return createPost(post);
});

export const removePost = createAsyncThunk("posts/remove", async (id: number) => {
  await deletePost(id);
  return id;
});

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearPosts: (state) => {
      state.list = [];
    },
    optimisticAddPost: (state, action: PayloadAction<Post>) => {
      state.list.unshift(action.payload);
    },
    optimisticRemovePost: (state, action: PayloadAction<number>) => {
      state.list = state.list.filter((p) => p.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Failed to fetch posts";
      })
      .addCase(addPost.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(removePost.fulfilled, (state, action) => {
        state.list = state.list.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearPosts, optimisticAddPost, optimisticRemovePost } = postsSlice.actions;
export default postsSlice.reducer;
