import { createBrowserRouter } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import StudentDashboard from "./pages/StudentDashboard";
import CourseCatalog from "./pages/CourseCatalog";
import CourseDetails from "./pages/CourseDetails";
import CheckoutPage from "./pages/CheckoutPage";
import CourseLearningPage from "./pages/CourseLearningPage";
import ProfilePage from "./pages/ProfilePage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCourses from "./pages/AdminCourses";
import DesignSystem from "./pages/DesignSystem";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: LandingPage,
    },
    {
        path: "/login",
        Component: LoginPage,
    },
    {
        path: "/register",
        Component: RegisterPage,
    },
    {
        path: "/forgot-password",
        Component: ForgotPasswordPage,
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute><StudentDashboard /></ProtectedRoute>,
    },
    {
        path: "/courses",
        Component: CourseCatalog,
    },
    {
        path: "/courses/:id",
        Component: CourseDetails,
    },
    {
        path: "/checkout/:id",
        element: <ProtectedRoute><CheckoutPage /></ProtectedRoute>,
    },
    {
        path: "/learn/:id",
        element: <ProtectedRoute><CourseLearningPage /></ProtectedRoute>,
    },
    {
        path: "/profile",
        element: <ProtectedRoute><ProfilePage /></ProtectedRoute>,
    },
    {
        path: "/admin",
        element: <ProtectedRoute><AdminDashboard /></ProtectedRoute>,
    },
    {
        path: "/admin/courses",
        element: <ProtectedRoute><AdminCourses /></ProtectedRoute>,
    },
    {
        path: "/design-system",
        Component: DesignSystem,
    },
    {
        path: "/reset-password",
        Component: ResetPasswordPage,
    },
]);
