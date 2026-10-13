import axios from "axios";

export const baseURL = "https://denclinc.duckdns.org/";

export const publicAxiosInstance = axios.create({
  baseURL,
});

export const privateAxiosInstance = axios.create({
  baseURL,
});

// ==========================
// Request Interceptor
// ==========================

privateAxiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ==========================
// Response Interceptor
// ==========================

privateAxiosInstance.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");

      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

// ==========================
// AUTH URLS
// ==========================

export const AUTH_URLS = {
  Login: `api/auth/login`,
  Forget_Pass: `api/auth/forgot-password`,
  Reset_Pass: `api/auth/new-password`,
};

// ==========================
// PATIENTS URLS
// ==========================

export const PATIENTS_URLS = {
  patients: `api/patients`,
  addPatient: `api/patients`,
  patientReports: (id) => `api/patients/${id}/reports`,
  getPatient: (id) => `api/patients/${id}`,
  editPatient: (id) => `api/patients/${id}`,
  deletePatient: (id) => `api/patients/${id}`,
};

// ==========================
// Inventory URLS
// ==========================

export const INVENTORY_URLS = {
  state: "api/inventory/stats",
  inventory: `api/inventory`,
  addInventory: `api/inventory`,
  getInventory: (id) => `api/inventory/${id}`,
  editInventory: (id) => `api/inventory/${id}`,
  deleteInventory: (id) => `api/inventory/${id}`,
};

export const REPORTS_URLS = {
  reports: `api/reports/dashboard`,
  top_services: `api/reports/top-services`,
  daily_prfit: `api/reports/daily-profit-dashboard`,
  booking_analytics: `api/reports/bookings-analytics`,
};

export const APPOINTMENTS_URLS = {
  appointments: `api/appointments`,
  addAppointment: `api/appointments`,
  getAppointment: (id) => `api/appointments/${id}`,
  editAppointment: (id) => `api/appointments/${id}`,
  editStatusAppointment: (id) => `api/appointments/${id}/status`,
  deleteAppointment: (id) => `api/appointments/${id}`,
  dailyAppointments: `api/appointments/daily`,
};

export const DAILY_APPOINTMENTS_URLS = {
  dailyAppointments: `api/daily-bookings`,
  addDailyAppointment: `api/daily-bookings`,
  editDailyAppointment: (id) => `api/daily-bookings/${id}`,
  deleteDailyAppointment: (id) => `api/daily-bookings/${id}`,
};

export const SETTINGS_URLS = {
  services: `api/settings/services`,
  addService: `api/settings/services`,
  editService: (id) => `api/settings/services/${id}`,
  deleteService: (id) => `api/settings/services/${id}`,

  users: `api/settings/users`,
  addUser: `api/settings/users`,
  editUser: (id) => `api/settings/users/${id}`,
  deleteUser: (id) => `api/settings/users/${id}`,
};