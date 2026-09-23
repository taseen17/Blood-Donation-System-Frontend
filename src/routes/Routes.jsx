import { createBrowserRouter } from "react-router";
import HomeLayout from "../layout/HomeLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MyProfile from "../pages/MyProfile";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ForgotPassword from "../pages/ForgotPassword";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeLayout/>,
        children:[
            {
                path: "/",
                element: <Home></Home>,
            }
        ]
    },
    {
        path: "/login",
        element: <Login></Login>
    },
    {
        path: "/signup",
        element: <Register></Register>
    },
    { path: "/forgot-password", element: <ForgotPassword /> },
    {
        element: <ProtectedRoute />,
        children: [
            { path: "/dashboard", element: <Dashboard /> },
            { path: "/myprofile", element: <MyProfile /> },
        ],
    },
    {
        element: <ProtectedRoute roles={["admin"]} />,
        children: [{ path: "/admin", element: <AdminDashboard /> }],
    },
]);

export default router;