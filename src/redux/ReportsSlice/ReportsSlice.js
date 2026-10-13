import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { REPORTS_URLS, privateAxiosInstance } from "../../Services/api.js";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  dashboard: null,
  topServices: null,
  dailyProfit: null,
  bookingAnalytics: null,

  loading: false,
  topServicesLoading: false,
  dailyProfitLoading: false,
  bookingAnalyticsLoading: false,

  error: null,
  topServicesError: null,
  dailyProfitError: null,
  bookingAnalyticsError: null,

  isFetched: false,
};

// =====================================================
// GET DASHBOARD
// =====================================================

export const getReportsDashboard = createAsyncThunk(
  "reports/getReportsDashboard",
  async (_, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.get(REPORTS_URLS.reports);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تحميل التقرير الرئيسي",
      );
    }
  },
);

// =====================================================
// GET TOP SERVICES
// =====================================================

export const getTopServices = createAsyncThunk(
  "reports/getTopServices",
  async (_, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.get(
        REPORTS_URLS.top_services,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تحميل تقرير الخدمات",
      );
    }
  },
);

// =====================================================
// GET DAILY PROFIT
// =====================================================

export const getDailyProfit = createAsyncThunk(
  "reports/getDailyProfit",
  async (_, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.get(REPORTS_URLS.daily_prfit);

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تحميل تقرير الأرباح اليومية",
      );
    }
  },
);

// =====================================================
// GET BOOKING ANALYTICS
// =====================================================

export const getBookingAnalytics = createAsyncThunk(
  "reports/getBookingAnalytics",
  async (_, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.get(
        REPORTS_URLS.booking_analytics,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تحميل تحليل الحجوزات",
      );
    }
  },
);

// =====================================================
// SLICE
// =====================================================

const reportsSlice = createSlice({
  name: "reports",

  initialState,

  reducers: {
    clearReports: (state) => {
      state.dashboard = null;
      state.topServices = null;
      state.dailyProfit = null;
      state.bookingAnalytics = null;

      state.error = null;
      state.topServicesError = null;
      state.dailyProfitError = null;
      state.bookingAnalyticsError = null;

      state.isFetched = false;
    },

    clearReportsErrors: (state) => {
      state.error = null;
      state.topServicesError = null;
      state.dailyProfitError = null;
      state.bookingAnalyticsError = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // DASHBOARD
      // =================================================

      .addCase(getReportsDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getReportsDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isFetched = true;

        state.dashboard = action.payload?.data || action.payload;
      })

      .addCase(getReportsDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // =================================================
      // TOP SERVICES
      // =================================================

      .addCase(getTopServices.pending, (state) => {
        state.topServicesLoading = true;
        state.topServicesError = null;
      })

      .addCase(getTopServices.fulfilled, (state, action) => {
        state.topServicesLoading = false;
        state.topServicesError = null;

        state.topServices = action.payload?.data || [];
      })

      .addCase(getTopServices.rejected, (state, action) => {
        state.topServicesLoading = false;
        state.topServicesError = action.payload;
      })

      // =================================================
      // DAILY PROFIT
      // =================================================

      .addCase(getDailyProfit.pending, (state) => {
        state.dailyProfitLoading = true;
        state.dailyProfitError = null;
      })

      .addCase(getDailyProfit.fulfilled, (state, action) => {
        state.dailyProfitLoading = false;
        state.dailyProfitError = null;

        state.dailyProfit = action.payload?.data || action.payload;
      })

      .addCase(getDailyProfit.rejected, (state, action) => {
        state.dailyProfitLoading = false;
        state.dailyProfitError = action.payload;
      })

      // =================================================
      // BOOKING ANALYTICS
      // =================================================

      .addCase(getBookingAnalytics.pending, (state) => {
        state.bookingAnalyticsLoading = true;
        state.bookingAnalyticsError = null;
      })

      .addCase(getBookingAnalytics.fulfilled, (state, action) => {
        state.bookingAnalyticsLoading = false;
        state.bookingAnalyticsError = null;

        state.bookingAnalytics = action.payload?.data || action.payload;
      })

      .addCase(getBookingAnalytics.rejected, (state, action) => {
        state.bookingAnalyticsLoading = false;
        state.bookingAnalyticsError = action.payload;
      });
  },
});

export const { clearReports, clearReportsErrors } = reportsSlice.actions;

export default reportsSlice.reducer;
