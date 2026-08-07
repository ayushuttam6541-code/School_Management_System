import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Facilities from "@/pages/Facilities";
import Faculty from "@/pages/Faculty";
import Gallery from "@/pages/Gallery";
import Events from "@/pages/Events";
import FeeStructure from "@/pages/FeeStructure";
import Contact from "@/pages/Contact";
import Admissions from "@/pages/Admissions";
import TrackAdmission from "@/pages/TrackAdmission";
import Login from "@/pages/Login";
import PaymentSuccess from "@/pages/PaymentSuccess";

import AdminOverview from "@/pages/dashboard/AdminOverview";
import AdminAdmissions from "@/pages/dashboard/AdminAdmissions";
import AdminContacts from "@/pages/dashboard/AdminContacts";
import StudentDashboard from "@/pages/dashboard/StudentDashboard";
import ParentDashboard from "@/pages/dashboard/ParentDashboard";
import TeacherDashboard from "@/pages/dashboard/TeacherDashboard";

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "facilities", element: <Facilities /> },
      { path: "faculty", element: <Faculty /> },
      { path: "gallery", element: <Gallery /> },
      { path: "events", element: <Events /> },
      { path: "fees", element: <FeeStructure /> },
      { path: "contact", element: <Contact /> },
      { path: "admissions", element: <Admissions /> },
      { path: "track-admission", element: <TrackAdmission /> },
      { path: "payment-success", element: <PaymentSuccess /> },
    ],
  },

  { path: "login", element: <Login /> },

  {
    element: <ProtectedRoute allow={["admin"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: "admin", element: <AdminOverview /> },
          { path: "admin/admissions", element: <AdminAdmissions /> },
          { path: "admin/contacts", element: <AdminContacts /> },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute allow={["student"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [{ path: "student", element: <StudentDashboard /> }],
      },
    ],
  },

  {
    element: <ProtectedRoute allow={["parent"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [{ path: "parent", element: <ParentDashboard /> }],
      },
    ],
  },

  {
    element: <ProtectedRoute allow={["teacher"]} />,
    children: [
      {
        element: <DashboardLayout />,
        children: [{ path: "teacher", element: <TeacherDashboard /> }],
      },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster position="top-center" richColors />
    </AuthProvider>
  );
}
