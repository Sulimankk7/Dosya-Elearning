import { createBrowserRouter } from "react-router-dom";
import React, { Suspense } from "react";
import { ProtectedRoute } from "./components/ProtectedRoute";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const LoginPage = React.lazy(() => import("./pages/LoginPage"));
const RegisterPage = React.lazy(() => import("./pages/RegisterPage"));
const ForgotPasswordPage = React.lazy(() => import("./pages/ForgotPasswordPage"));
const StudentDashboard = React.lazy(() => import("./pages/StudentDashboard"));
const CourseCatalog = React.lazy(() => import("./pages/CourseCatalog"));
const CourseDetails = React.lazy(() => import("./pages/CourseDetails"));
const CheckoutPage = React.lazy(() => import("./pages/CheckoutPage"));
const CourseLearningPage = React.lazy(() => import("./pages/CourseLearningPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));
const AdminCourses = React.lazy(() => import("./pages/AdminCourses"));
const DesignSystem = React.lazy(() => import("./pages/DesignSystem"));
const ResetPasswordPage = React.lazy(() => import("./pages/ResetPasswordPage"));
const LessonPage = React.lazy(() => import("./pages/LessonPage"));
const NotFoundPage = React.lazy(() => import("./pages/NotFoundPage"));

const SuspenseWrapper = ({ children }: { children: React.ReactNode }) => (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">جاري التحميل...</div>}>
        {children}
    </Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: <SuspenseWrapper><LandingPage /></SuspenseWrapper>,
    },
    {
        path: "/login",
        element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>,
    },
    {
        path: "/register",
        element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>,
    },
    {
        path: "/forgot-password",
        element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>,
    },
    {
        path: "/dashboard",
        element: <ProtectedRoute><SuspenseWrapper><StudentDashboard /></SuspenseWrapper></ProtectedRoute>,
    },
    {
        path: "/courses",
        element: <SuspenseWrapper><CourseCatalog /></SuspenseWrapper>,
    },
    {
        path: "/courses/:id",
        element: <SuspenseWrapper><CourseDetails /></SuspenseWrapper>,
    },
    {
        path: "/checkout/:id",
        element: <ProtectedRoute><SuspenseWrapper><CheckoutPage /></SuspenseWrapper></ProtectedRoute>,
    },
    {
        path: "/learn/:id",
        element: <ProtectedRoute><SuspenseWrapper><CourseLearningPage /></SuspenseWrapper></ProtectedRoute>,
    },
    {
        path: "/profile",
        element: <ProtectedRoute><SuspenseWrapper><ProfilePage /></SuspenseWrapper></ProtectedRoute>,
    },
    {
        path: "/admin",
        element: <ProtectedRoute><SuspenseWrapper><AdminDashboard /></SuspenseWrapper></ProtectedRoute>,
    },
    {
        path: "/admin/courses",
        element: <ProtectedRoute><SuspenseWrapper><AdminCourses /></SuspenseWrapper></ProtectedRoute>,
    },
    {
        path: "/design-system",
        element: <SuspenseWrapper><DesignSystem /></SuspenseWrapper>,
    },
    {
        path: "/reset-password",
        element: <SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper>,
    },
    {
        path: "/lesson/:id",
        element: <ProtectedRoute><SuspenseWrapper><LessonPage /></SuspenseWrapper></ProtectedRoute>,
    },
    {
        path: "*",
        element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
    },
]);
