import React from 'react';
import ToDo from "./components/ToDo"
import SignUp from "./components/signUp";
import LogIn from "./components/logIn"
import Home from "./components/home"
import MovingBg from "./layout/movingBg"
import ProtectedRoute from "./ProtectedRoute";
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ToastLayout from './layout/ToastLayout';


const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/login", element: <LogIn /> },
    { path: "/signup", element: <SignUp /> },
    {
    path: "/todo",
      element: (
        <ProtectedRoute>
          <ToDo />
        </ProtectedRoute>
      ),
    },
])

function App() {
  return (
    <ToastLayout>
      <MovingBg>
          <RouterProvider router={router} />
      </MovingBg>
    </ToastLayout>
  );
}

export default App;