import { useState } from 'react';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router';

import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Register, { action as registerAction} from './pages/Register';
import Login from './pages/Login';
import Error from './pages/Error';
import Dashboard from './pages/profile/Dashboard';



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
    />
    <Route 
      path="dashboard"
      element={<Dashboard />}
    />

    /* Error page */
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
