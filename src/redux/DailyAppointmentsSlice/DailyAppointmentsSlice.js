import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DAILY_APPOINTMENTS_URLS, privateAxiosInstance } from "../../Services/api";


// ========================
// Initial State
// ========================

const initialState = {
  appointments: [],
  appointmentDetails: null,

  loading: false,
  error: null,

  success: false,

  isFetched: false,
};

// ========================
// GET DAILY APPOINTMENTS
// ========================

export const getDailyAppointments = createAsyncThunk(
  "dailyAppointments/getDailyAppointments",

  async (date, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.get(
        `${DAILY_APPOINTMENTS_URLS.dailyAppointments}?date=${date}`,
      );

      console.log('Daily Appointments Response:', response.data);

      return response.data;
    } catch (error) {
      console.log(error);

      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "حدث خطأ أثناء جلب الحجوزات اليومية",
      );
    }
  },
);

// ========================
// ADD DAILY APPOINTMENT
// ========================

export const addDailyAppointment = createAsyncThunk(
  "dailyAppointments/addDailyAppointment",

  async (appointmentData, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.post(
        DAILY_APPOINTMENTS_URLS.addDailyAppointment,
        appointmentData,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل إضافة الحجز",
      );
    }
  },
);

// ========================
// EDIT DAILY APPOINTMENT
// ========================

export const editDailyAppointment = createAsyncThunk(
  "dailyAppointments/editDailyAppointment",

  async ({ id, data }, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.put(
        DAILY_APPOINTMENTS_URLS.editDailyAppointment(id),
        data,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تعديل الحجز",
      );
    }
  },
);

// ========================
// DELETE DAILY APPOINTMENT
// ========================

export const deleteDailyAppointment = createAsyncThunk(
  "dailyAppointments/deleteDailyAppointment",

  async (id, thunkAPI) => {
    try {
      await privateAxiosInstance.delete(
        DAILY_APPOINTMENTS_URLS.deleteDailyAppointment(id),
      );

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل حذف الحجز",
      );
    }
  },
);

// ========================
// Slice
// ========================

const dailyAppointmentsSlice = createSlice({
  name: "dailyAppointments",

  initialState,

  reducers: {
    resetDailyAppointmentsState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ========================
      // GET DAILY APPOINTMENTS
      // ========================

      .addCase(getDailyAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getDailyAppointments.fulfilled, (state, action) => {
        state.loading = false;

        state.isFetched = true;

        state.appointments = action.payload.data || action.payload;
      })

      .addCase(getDailyAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================
      // ADD DAILY APPOINTMENT
      // ========================

      .addCase(addDailyAppointment.pending, (state) => {
        state.loading = true;
      })

      .addCase(addDailyAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.appointments.unshift(action.payload.data || action.payload);
      })

      .addCase(addDailyAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================
      // EDIT DAILY APPOINTMENT
      // ========================

      .addCase(editDailyAppointment.pending, (state) => {
        state.loading = true;
      })

      .addCase(editDailyAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        const updatedAppointment = action.payload.data || action.payload;

        state.appointments = state.appointments.map((appointment) =>
          appointment._id === updatedAppointment._id
            ? updatedAppointment
            : appointment,
        );
      })

      .addCase(editDailyAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ========================
      // DELETE DAILY APPOINTMENT
      // ========================

      .addCase(deleteDailyAppointment.pending, (state) => {
        state.loading = true;
      })

      .addCase(deleteDailyAppointment.fulfilled, (state, action) => {
        state.loading = false;

        state.appointments = state.appointments.filter(
          (appointment) => appointment._id !== action.payload,
        );
      })

      .addCase(deleteDailyAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDailyAppointmentsState } = dailyAppointmentsSlice.actions;

export default dailyAppointmentsSlice.reducer;
