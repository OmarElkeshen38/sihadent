import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { APPOINTMENTS_URLS, privateAxiosInstance } from "../../Services/api";

// ========================
// Initial State
// ========================

const initialState = {
  appointments: [],
  dailyAppointments: [],

  appointmentDetails: null,

  stats: null,

  loading: false,
  error: null,

  success: false,

  isFetched: false,
};

// ========================
// GET APPOINTMENTS
// ========================

export const getAppointments = createAsyncThunk(
  "appointments/getAppointments",

  async (
    { view = "week", date = new Date().toISOString().split("T")[0] } = {},
    thunkAPI,
  ) => {
    try {
      const response = await privateAxiosInstance.get(
        `${APPOINTMENTS_URLS.appointments}?view=${view}&date=${date}`,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تحميل المواعيد",
      );
    }
  },
);

// ========================
// GET APPOINTMENT DETAILS
// ========================

export const getAppointment = createAsyncThunk(
  "appointments/getAppointment",

  async (id, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.get(
        APPOINTMENTS_URLS.getAppointment(id),
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تحميل بيانات الموعد",
      );
    }
  },
);

// ========================
// ADD APPOINTMENT
// ========================

export const addAppointment = createAsyncThunk(
  "appointments/addAppointment",

  async (appointmentData, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.post(
        APPOINTMENTS_URLS.addAppointment,
        appointmentData,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل إضافة الموعد",
      );
    }
  },
);

// ========================
// EDIT APPOINTMENT
// ========================

export const editAppointment = createAsyncThunk(
  "appointments/editAppointment",

  async ({ id, data }, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.put(
        APPOINTMENTS_URLS.editAppointment(id),
        data,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تعديل الموعد",
      );
    }
  },
);

// ========================
// EDIT APPOINTMENT STATUS
// ========================

export const editStatusAppointment = createAsyncThunk(
  "appointments/editStatusAppointment",
  async ({ id, status }, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.put(
        APPOINTMENTS_URLS.editStatusAppointment(id),
        { status },
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تحديث حالة الموعد",
      );
    }
  },
);

// ========================
// DELETE APPOINTMENT
// ========================

export const deleteAppointment = createAsyncThunk(
  "appointments/deleteAppointment",

  async (id, thunkAPI) => {
    try {
      await privateAxiosInstance.delete(
        APPOINTMENTS_URLS.deleteAppointment(id),
      );

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل حذف الموعد",
      );
    }
  },
);

// ========================
// GET DAILY APPOINTMENTS
// ========================

export const getDailyAppointments = createAsyncThunk(
  "appointments/getDailyAppointments",

  async (_, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.get(
        APPOINTMENTS_URLS.dailyAppointments,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تحميل مواعيد اليوم",
      );
    }
  },
);

// ========================
// Slice
// ========================

const appointmentsSlice = createSlice({
  name: "appointments",

  initialState,

  reducers: {
    resetAppointmentsState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    clearAppointmentDetails: (state) => {
      state.appointmentDetails = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ========================
      // GET APPOINTMENTS
      // ========================

      .addCase(getAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.isFetched = true;

        state.appointments = action.payload.data || [];
        state.stats = action.payload.stats || null;
      })

      .addCase(getAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================
      // GET APPOINTMENT DETAILS
      // ========================

      .addCase(getAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAppointment.fulfilled, (state, action) => {
        state.loading = false;

        state.appointmentDetails = action.payload.data || action.payload;
      })

      .addCase(getAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================
      // ADD APPOINTMENT
      // ========================

      .addCase(addAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const newAppointment = action.payload.data || action.payload;

        state.appointments.unshift(newAppointment);
      })

      .addCase(addAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================
      // EDIT APPOINTMENT
      // ========================

      .addCase(editAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(editAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedAppointment = action.payload.data || action.payload;

        state.appointments = state.appointments.map((appointment) =>
          appointment._id === updatedAppointment._id
            ? updatedAppointment
            : appointment,
        );

        if (state.appointmentDetails?._id === updatedAppointment._id) {
          state.appointmentDetails = updatedAppointment;
        }
      })

      .addCase(editAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================
      // EDIT STATUS
      // ========================

      .addCase(editStatusAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(editStatusAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedAppointment = action.payload.data || action.payload;

        state.appointments = state.appointments.map((appointment) =>
          appointment._id === updatedAppointment._id
            ? updatedAppointment
            : appointment,
        );

        if (state.appointmentDetails?._id === updatedAppointment._id) {
          state.appointmentDetails = updatedAppointment;
        }
      })

      .addCase(editStatusAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================
      // DELETE APPOINTMENT
      // ========================

      .addCase(deleteAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.loading = false;

        state.appointments = state.appointments.filter(
          (appointment) => appointment._id !== action.payload,
        );

        if (state.appointmentDetails?._id === action.payload) {
          state.appointmentDetails = null;
        }
      })

      .addCase(deleteAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================
      // DAILY APPOINTMENTS
      // ========================

      .addCase(getDailyAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getDailyAppointments.fulfilled, (state, action) => {
        state.loading = false;

        state.dailyAppointments = action.payload.data || [];
      })

      .addCase(getDailyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAppointmentsState, clearAppointmentDetails } =
  appointmentsSlice.actions;

export default appointmentsSlice.reducer;
