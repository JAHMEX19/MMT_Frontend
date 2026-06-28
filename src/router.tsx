import {BrowserRouter, Routes , Route } from 'react-router-dom';
import LoginView from './views/authViews/LoginView';
import RegisterView from './views/authViews/RegisterView';
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';
import ProfileView from './views/appViews/ProfileView';
import DashboardView from './views/appViews/DashboardView';




export default function Router() {
  return (
    <BrowserRouter>
      <Routes >
        <Route element={<AuthLayout />} >
            <Route path="/auth/login" element={<LoginView />} />
            <Route path="/auth/signup" element={<RegisterView />} />
        </Route>

        <Route element={<AppLayout />} >
            <Route path="/admin/dashboard" element={<DashboardView />} />
            <Route path="/admin/profile" element={<ProfileView />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}