import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privateAxiosInstance, SETTINGS_URLS } from "../../Services/api";

// ==================== GET USERS ====================
export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.get(SETTINGS_URLS.users);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تحميل المستخدمين",
      );
    }
  },
);

// ==================== ADD USER ====================
export const addUser = createAsyncThunk(
  "users/addUser",
  async (data, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.post(
        SETTINGS_URLS.addUser,
        data,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل إضافة المستخدم",
      );
    }
  },
);

export const toggleUserStatus = createAsyncThunk(
  "users/toggleUserStatus",
  async ({ id, isActive }, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.patch(
        SETTINGS_URLS.editUser(id),
        {
          isActive,
        },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تغيير حالة المستخدم",
      );
    }
  },
);

// ==================== EDIT USER ====================
export const editUser = createAsyncThunk(
  "users/editUser",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.patch(
        SETTINGS_URLS.editUser(id),
        data,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تعديل المستخدم",
      );
    }
  },
);

// ==================== DELETE USER ====================
export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.delete(
        SETTINGS_URLS.deleteUser(id),
      );

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل حذف المستخدم",
      );
    }
  },
);

const initialState = {
  users: [],
  stats: {
    total: 0,
    doctors: 0,
    receptionists: 0,
    active: 0,
  },
  loading: false,
  error: null,
  success: false,
};

const usersSlice = createSlice({
  name: "users",

  initialState,

  reducers: {
    clearUsersMessage: (state) => {
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    // ==================== GET ====================
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload?.data || [];

        state.stats = action.payload?.stats || {
          total: 0,
          doctors: 0,
          receptionists: 0,
          active: 0,
        };

        state.success = true;
      })

      .addCase(getUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ==================== ADD ====================
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const newUser = action.payload?.data || action.payload;

        if (newUser?._id) {
          state.users.unshift(newUser);
        }
      })

      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // ==================== EDIT ====================
    builder
      .addCase(editUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(editUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedUser = action.payload?.data || action.payload;

        if (updatedUser?._id) {
          state.users = state.users.map((user) =>
            user._id === updatedUser._id ? updatedUser : user,
          );
        }
      })

      .addCase(editUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // ==================== DELETE ====================
    builder
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.users = state.users.filter(
          (user) => user._id !== action.payload.id,
        );
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // ==================== TOGGLE STATUS ====================
    builder
      .addCase(toggleUserStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedUser = action.payload?.data || action.payload;

        if (updatedUser?._id) {
          state.users = state.users.map((user) =>
            user._id === updatedUser._id ? updatedUser : user,
          );
        }
      })

      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUsersMessage } = usersSlice.actions;

export default usersSlice.reducer;
