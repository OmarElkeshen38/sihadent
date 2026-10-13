import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice/authSlice";
import patientsReducer from "./PatientsSclice/PatientsSclice";
import dailyAppointmentsReducer from "./DailyAppointmentsSlice/DailyAppointmentsSlice";
import appointmentsReducer from "./AppointmentsSlice/AppointmentsSlice";
import servicesReducer from "./ServicesSlice/ServicesSlice";
import usersReducer from "./UsersSlice/UsersSlice";
import reportsReducer from "./ReportsSlice/ReportsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    patients: patientsReducer,
    dailyAppointments: dailyAppointmentsReducer,
    appointments: appointmentsReducer,
    reports: reportsReducer,
    services: servicesReducer,
    users: usersReducer,
  },
});