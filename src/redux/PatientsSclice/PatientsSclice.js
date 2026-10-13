import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { PATIENTS_URLS, privateAxiosInstance } from "../../Services/api.js";

// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  patients: [],

  patientDetails: null,

  // Full medical report
  patientReport: null,

  pagination: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  },

  loading: false,

  error: null,

  success: false,

  isFetched: false,
};

// =====================================================
// GET ALL PATIENTS
// =====================================================

export const getPatients = createAsyncThunk(
  "patients/getPatients",

  async ({ page = 1, limit = 20, search = "" } = {}, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.get(
        `${PATIENTS_URLS.patients}?page=${page}&limit=${limit}&search=${encodeURIComponent(
          search,
        )}`,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "حدث خطأ أثناء جلب المرضى",
      );
    }
  },
);

// =====================================================
// GET SINGLE PATIENT
// =====================================================

export const getPatient = createAsyncThunk(
  "patients/getPatient",

  async (id, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.get(
        PATIENTS_URLS.getPatient(id),
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "حدث خطأ أثناء جلب بيانات المريض",
      );
    }
  },
);

// =====================================================
// GET PATIENT MEDICAL REPORT
// =====================================================

export const getPatientReport = createAsyncThunk(
  "patients/getPatientReport",

  async (id, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.get(
        PATIENTS_URLS.patientReports(id),
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تحميل الملف الطبي",
      );
    }
  },
);

// =====================================================
// ADD PATIENT
// =====================================================

export const addPatient = createAsyncThunk(
  "patients/addPatient",

  async (patientData, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.post(
        PATIENTS_URLS.addPatient,
        patientData,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل إضافة المريض",
      );
    }
  },
);

// =====================================================
// EDIT PATIENT
// =====================================================

export const editPatient = createAsyncThunk(
  "patients/editPatient",

  async ({ id, data }, thunkAPI) => {
    try {
      const response = await privateAxiosInstance.put(
        PATIENTS_URLS.editPatient(id),
        data,
      );

      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل تعديل بيانات المريض",
      );
    }
  },
);

// =====================================================
// DELETE PATIENT
// =====================================================

export const deletePatient = createAsyncThunk(
  "patients/deletePatient",

  async (id, thunkAPI) => {
    try {
      await privateAxiosInstance.delete(PATIENTS_URLS.deletePatient(id));

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "فشل حذف المريض",
      );
    }
  },
);

// =====================================================
// SLICE
// =====================================================

const patientsSlice = createSlice({
  name: "patients",

  initialState,

  reducers: {
    // -----------------------------------------------
    // RESET GENERAL STATE
    // -----------------------------------------------

    resetPatientsState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },

    // -----------------------------------------------
    // CLEAR SINGLE PATIENT
    // -----------------------------------------------

    clearPatientDetails: (state) => {
      state.patientDetails = null;
    },

    // -----------------------------------------------
    // CLEAR PATIENT REPORT
    // -----------------------------------------------

    clearPatientReport: (state) => {
      state.patientReport = null;
    },

    // -----------------------------------------------
    // CLEAR ERROR
    // -----------------------------------------------

    clearPatientsError: (state) => {
      state.error = null;
    },

    // -----------------------------------------------
    // CLEAR SUCCESS
    // -----------------------------------------------

    clearPatientsSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // =================================================
      // GET PATIENTS
      // =================================================

      .addCase(getPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.isFetched = true;

        state.patients = action.payload?.data || [];

        state.pagination = action.payload?.stats || {
          total: 0,
          page: 1,
          limit: 20,
          pages: 1,
        };
      })

      .addCase(getPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isFetched = false;
      })

      // =================================================
      // GET SINGLE PATIENT
      // =================================================

      .addCase(getPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.patientDetails = action.payload?.data || action.payload;
      })

      .addCase(getPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        state.patientDetails = null;
      })

      // =================================================
      // GET PATIENT REPORT
      // =================================================

      .addCase(getPatientReport.pending, (state) => {
        state.loading = true;
        state.error = null;

        // Clear old patient's report
        state.patientReport = null;
      })

      .addCase(getPatientReport.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.patientReport = action.payload?.data || action.payload;
      })

      .addCase(getPatientReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;

        state.patientReport = null;
      })

      // =================================================
      // ADD PATIENT
      // =================================================

      .addCase(addPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(addPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        const newPatient = action.payload?.data || action.payload;

        if (newPatient) {
          state.patients.unshift(newPatient);
        }
      })

      .addCase(addPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // =================================================
      // EDIT PATIENT
      // =================================================

      .addCase(editPatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(editPatient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        const updatedPatient = action.payload?.data || action.payload;

        if (!updatedPatient?._id) {
          return;
        }

        // Update patients list
        state.patients = state.patients.map((patient) =>
          patient._id === updatedPatient._id ? updatedPatient : patient,
        );

        // Update patient details
        if (state.patientDetails?._id === updatedPatient._id) {
          state.patientDetails = updatedPatient;
        }

        // Update patient inside medical report
        if (state.patientReport?.patient?._id === updatedPatient._id) {
          state.patientReport.patient = updatedPatient;
        }
      })

      .addCase(editPatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })

      // =================================================
      // DELETE PATIENT
      // =================================================

      .addCase(deletePatient.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(deletePatient.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.success = true;

        const deletedId = action.payload;

        // Remove from patients list
        state.patients = state.patients.filter(
          (patient) => patient._id !== deletedId,
        );

        // Clear patient details if same patient
        if (state.patientDetails?._id === deletedId) {
          state.patientDetails = null;
        }

        // Clear report if same patient
        if (state.patientReport?.patient?._id === deletedId) {
          state.patientReport = null;
        }
      })

      .addCase(deletePatient.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

// =====================================================
// ACTIONS
// =====================================================

export const {
  resetPatientsState,
  clearPatientDetails,
  clearPatientReport,
  clearPatientsError,
  clearPatientsSuccess,
} = patientsSlice.actions;

// =====================================================
// SELECTORS
// =====================================================

export const selectPatients = (state) => state.patients?.patients || [];

export const selectPatientDetails = (state) =>
  state.patients?.patientDetails || null;

export const selectPatientReport = (state) =>
  state.patients?.patientReport || null;

export const selectPatientsPagination = (state) =>
  state.patients?.pagination || {
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  };

export const selectPatientsLoading = (state) =>
  state.patients?.loading || false;

export const selectPatientsError = (state) => state.patients?.error || null;

export default patientsSlice.reducer;
