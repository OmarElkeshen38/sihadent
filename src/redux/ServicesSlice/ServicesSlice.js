import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { privateAxiosInstance, SETTINGS_URLS } from "../../Services/api";

// ===============================
// Get Services
// ===============================
export const getServices = createAsyncThunk(
  "services/getServices",
  async (_, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.get(SETTINGS_URLS.services);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تحميل الخدمات",
      );
    }
  },
);

// ===============================
// Add Service
// ===============================
export const addService = createAsyncThunk(
  "services/addService",
  async (data, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.post(
        SETTINGS_URLS.addService,
        data,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل إضافة الخدمة",
      );
    }
  },
);

// ===============================
// Edit Service
// ===============================
export const editService = createAsyncThunk(
  "services/editService",
  async ({ id, data }, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.put(
        SETTINGS_URLS.editService(id),
        data,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تعديل الخدمة",
      );
    }
  },
);

// ===============================
// Delete Service
// ===============================
export const deleteService = createAsyncThunk(
  "services/deleteService",
  async (id, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.delete(
        SETTINGS_URLS.deleteService(id),
      );

      return {
        id,
        ...response.data,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل حذف الخدمة",
      );
    }
  },
);

// ===============================
// Initial State
// ===============================
const initialState = {
  services: [],
  stats: {
    total: 0,
    byCategory: {},
  },

  loading: false,
  error: null,
  success: false,
};

// ===============================
// Slice
// ===============================
const servicesSlice = createSlice({
  name: "services",
  initialState,

  reducers: {
    clearServicesMessage: (state) => {
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    // ============================
    // GET
    // ============================
    builder
      .addCase(getServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getServices.fulfilled, (state, action) => {
        state.loading = false;

        state.services = action.payload?.data || [];

        state.stats = action.payload?.stats || {
          total: 0,
          byCategory: {},
        };

        state.success = true;
      })

      .addCase(getServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ============================
    // ADD
    // ============================
    builder
      .addCase(addService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(addService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const newService = action.payload?.data || action.payload;

        if (newService?._id) {
          state.services.unshift(newService);
        }
      })

      .addCase(addService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // ============================
    // EDIT
    // ============================
    builder
      .addCase(editService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(editService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedService = action.payload?.data || action.payload;

        if (updatedService?._id) {
          state.services = state.services.map((service) =>
            service._id === updatedService._id ? updatedService : service,
          );
        }
      })

      .addCase(editService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });

    // ============================
    // DELETE
    // ============================
    builder
      .addCase(deleteService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.services = state.services.filter(
          (service) => service._id !== action.payload.id,
        );
      })

      .addCase(deleteService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { clearServicesMessage } = servicesSlice.actions;

export default servicesSlice.reducer;
