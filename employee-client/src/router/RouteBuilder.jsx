import AdminLayout from "@/layout/AdminLayout";
import AuthGuard from "@/layout/guard/AuthGuard";
import UserLayout from "@/layout/UserLayout";
import EmployeePage from "@/pages/admin/employee/Page";
import LeavePage from "@/pages/admin/leave/Page";
import SalaryPage from "@/pages/admin/salary/Page";
import TeamPage from "@/pages/admin/team/Page";
import TaskPage from "@/pages/user/task/Page";
import UserLeavePage from "../pages/user/leave/Page";
import ProfilePage from "../pages/ProfilePage";
import LeaveApplications from "../pages/admin/leave/LeaveApplications";
import AdminTask from "../pages/admin/task/Page";
import TeamDetails from "../pages/admin/team/Details";

const RouteBuilder = (role) => {
  if (role == "ADMIN") {
    return adminRoutes;
  }
  return userRoutes;
};
export default RouteBuilder;

const adminRoutes = [
  {
    path: "/admin",
    element: (
      <AuthGuard>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { path: "", element: <>Admin Dashboard</> },
      { path: "employee", element: <EmployeePage /> },
      { path: "team", element: <TeamPage /> },
      { path: "team_details/:team_id", element: <TeamDetails /> },
      { path: "salary", element: <SalaryPage /> },
      { path: "task", element: <AdminTask /> },
      { path: "leave-application", element: <LeaveApplications /> },
      { path: "leave", element: <LeavePage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
];

const userRoutes = [
  {
    path: "/user",
    element: (
      <AuthGuard>
        <UserLayout />
      </AuthGuard>
    ),
    children: [
      { path: "", element: <>User Dashboard</> },
      { path: "task", element: <TaskPage /> },
      { path: "leave", element: <UserLeavePage /> },
      { path: "profile", element: <ProfilePage /> },
    ],
  },
];
