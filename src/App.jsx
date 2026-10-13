import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Componants/Layout/Layout'
import Dasboard from './Componants/Dasboard/Dasboard'
import PatientsPage from './Componants/Patient/PatientsPage'
import Appointments from './Componants/Appointments/Appointments'
import PaymentDashboard from './Componants/Payments/PaymentDashboard'
import InventoryDashboard from './Componants/Inventory/InventoryDashboard'
import Settings from './Componants/Settings/Settings'
import Login from './Auth/Login/Login'
import { AuthProvider } from './Componants/Context/Context'
import ProtectedRoute from './Componants/ProtectedRoute/ProtectedRoute'
import AuthLayout from './Auth/AuthLayout/AuthLayout'
import ForgetPass from './Auth/ForgetPass/ForgetPass'
import NotFound from './Componants/NotFound/NotFound'
import ResetPass from './Auth/ResetPass/ResetPass';
import ReceptionistLayout from './Receptionist/ReceptionistLayout/ReceptionistLayout';
import PublicRoute from './Auth/AuthLayout/PublicRoute/PublicRoute';
import DailyAppointments from './Componants/DailyAppointments/DailyAppointments';
import PatientDetails from './Componants/Patient/PatientDetails';
import Reports from './Componants/Reports/Reports';


const routing = createBrowserRouter([
  {
    path: '/', element: <AuthLayout />, children: [
      { index: true, element: <PublicRoute><Login /></PublicRoute> },
      { path: '/Login', element: <PublicRoute><Login /></PublicRoute> },
      { path: '/forget-password', element: <ForgetPass /> },
      { path: '/reset-password', element: <ResetPass /> }
    ]
  },
  { path: '/reception', element: <ProtectedRoute allowedRoles={["receptionist"]}><ReceptionistLayout /></ProtectedRoute> },
  {
    path: '/doctor',
    element: <ProtectedRoute allowedRoles={["doctor"]}><Layout /></ProtectedRoute>,
    children: [
      { index: true, element: <Dasboard /> },
      { path: 'dashboard', element: <Dasboard /> },
      { path: 'patients', element: <PatientsPage /> },
      { path: 'patients/:id', element: <PatientDetails /> },
      { path: 'appointments', element: <Appointments /> },
      { path: 'daily-appointments', element: <DailyAppointments /> },
      { path: 'payments', element: <PaymentDashboard /> },
      { path: 'inventory', element: <InventoryDashboard /> },
      { path: 'reports', element: <Reports /> },
      { path: 'settings', element: <Settings /> }
    ]
  },
  { path: '*', element: <NotFound /> },
]);

function App() {

  return (
    <>
      <ToastContainer position="top-center" />
      <AuthProvider>
        <RouterProvider router={routing} />
      </AuthProvider>
    </>
  );
}
export default App;