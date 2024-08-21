import { Outlet } from "react-router-dom";
import NavbarComponent from "../components/Navbar";
import {
  CodeBracketSquareIcon,
  CalendarDateRangeIcon,
} from "@heroicons/react/24/solid";

const UserLayout = () => {
  const navListItems = [
    {
      label: "Task",
      icon: CodeBracketSquareIcon,
      path: "/user/task",
    },
    {
      label: "Leave",
      icon: CalendarDateRangeIcon,
      path: "/user/leave",
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
export default UserLayout;
