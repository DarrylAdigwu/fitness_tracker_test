import React from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, redirect} from 'react-router';

import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Register, { action as registerAction} from './pages/Register';
import Login, { loader as loginLoader, action as loginAction } from './pages/Login';
import Error from './pages/Error'; 
import DashboardLayout from './components/DashboardLayout';
import Dashboard, { action as dashboardAction, loader as dashboardLoader } from './pages/profile/Dashboard';


const router = createBrowserRouter(createRoutesFromElements(
  <Route path="/" element={<Layout />}>
    <Route
      index
      element={<Home />}
    />
    <Route
      path="about"
      element={<About />}
    />
    <Route 
      path="register"
      element={<Register />}
      action={registerAction}
    />
    <Route 
      path="login"
      element={<Login />}
      loader={loginLoader}
      action={loginAction}
    />
    <Route 
      path="dashboard" 
      element={<DashboardLayout />} 
      >
      <Route 
        index
        loader={async() => redirect(`:username`)}
        />
      <Route 
        path=":username"
        element={<Dashboard />}
        loader={dashboardLoader}
        action={dashboardAction}
        />

    </Route>

    {/* Error page */} 
    <Route 
      path="*"
      element={<Error />}
    />
  </Route> 
));

export default function App() {
  return (
    <RouterProvider router={router}/>
  )
}
