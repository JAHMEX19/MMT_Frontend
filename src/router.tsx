import {BrowserRouter, Routes , Route } from 'react-router-dom';
import LoginView from './views/authViews/LoginView';
import RegisterView from './views/authViews/RegisterView';
import AuthLayout from './layouts/AuthLayout';



export default function Router() {
  return (
    <BrowserRouter>
      <Routes >
        <Route element={<AuthLayout />} >
            <Route path="/auth/login" element={<LoginView />} />
            <Route path="/auth/signup" element={<RegisterView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}