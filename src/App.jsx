import React from 'react';
import ToDo from "./components/ToDo"
import SignUp from "./components/signUp";
import LogIn from "./components/logIn"
import Home from "./components/home"
import MovingBg from "./layout/movingBg"
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import ToastLayout from './layout/ToastLayout';


const router = createBrowserRouter([
    { path: "/", element: <Home /> },
    { path: "/logIn", element: <LogIn /> },
    { path: "/signUp", element: <SignUp /> },
    { path: "/ToDo", element: <ToDo /> },
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