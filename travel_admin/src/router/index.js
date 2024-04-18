import { createBrowserRouter } from "react-router-dom";
import Layout from "@/pages/Layout"
import Login from '@/pages/Login'
import AuthRoute from "@/components/AuthRoute";
import Note from "@/pages/Note";
// import Home from "@/pages/Home";

const router = createBrowserRouter([
  { 
    path: '/', 
    element: <AuthRoute><Layout /></AuthRoute>,
    children:[
      {
        index: true,
        element: <Note></Note>
      },
      // {
      //   path: 'home',
      //   element: <Note></Note>
      // }
    ]
  },
  {
    path: '/login',
    element: <Login />,
  }
])

export default router;