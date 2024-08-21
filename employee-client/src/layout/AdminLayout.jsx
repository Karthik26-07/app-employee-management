import { Outlet } from "react-router-dom";
import NavbarComponent from "../components/Navbar";
import {
  UserCircleIcon,
  CodeBracketSquareIcon,
  CurrencyRupeeIcon,
  CalendarDateRangeIcon,
  CubeIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/solid";

const AdminLayout = () => {
  const navListItems = [
    {
      label: "Employee",
      icon: UserCircleIcon,
      path: "/admin/employee",
    },
    {
      label: "Team",
      icon: CubeIcon,
      path: "/admin/team",
    },
    {
      label: "Task",
      icon: CodeBracketSquareIcon,
      path: "/admin/task",
    },
    {
      label: "Leave Applications",
      icon: CalendarDaysIcon,
      path: "/admin/leave-application",
    },
    {
      label: "Salary",
      icon: CurrencyRupeeIcon,
      path: "/admin/salary",
    },
    {
      label: "Leave",
      icon: CalendarDateRangeIcon,
      path: "/admin/leave",
    },
  ];

  return (
    <div className="container-fluid">
      <NavbarComponent navListItems={navListItems} />
      <div className="mx-2 mt-3 mb-10">
        <Outlet />
      </div>
    </div>
  );
};
export default AdminLayout;
