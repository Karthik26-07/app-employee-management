import { statusColors } from "../../../config/constants";
import UserAvatar from "@/components/UserAvatar";
import DataTable from "@/components/DataTable";
import SimpleTextCell from "@/components/SimpleTextCell";
import { useEffect, useState } from "react";
import {
  Typography,
  Button,
  List,
  ListItem,
  Chip,
  Tooltip,
  IconButton,
} from "@material-tailwind/react";
import { TeamApi } from "../../../Api/TeamApi";
import { useAuth } from "../../../lib/hooks/useAuth";
import { showErrorToast } from "../../../lib/utils/toasts";
import { TaskApi } from "../../../Api/TaskApi";
import { formateDate } from "../../../lib/utils/custom";
const AdminTask = () => {
  const [selectedTeam, setSelectedTeam] = useState();
  const [teams, setTeams] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const { role } = useAuth();
  const fetchData = async () => {
    try {
      const response = await TeamApi.getTeamsByLead({ role: "Admin" });
      const data = response.data;
      if (data.length > 0) {
        setTeams(data);
        setSelectedTeam(data[0].id);
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const fetchTask = async () => {
    try {
      const params = { team_id: selectedTeam, role: role };
      const response = await TaskApi.taskByTeam(params);
      setTaskData(response.data);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [selectedTeam]);

  useEffect(() => {
    fetchData();
  }, []);
  const columns = [
    {
      accessorKey: "lead_image",
      header: "Team Lead",
      cell: (info) => (
        <UserAvatar
          name={info.row.original.lead_name}
          email={info.row.original.lead_email}
          image={info.getValue()}
        />
      ),
    },
    {
      accessorKey: "task_title",
      header: "Task Title",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },
    {
      accessorKey: "task_description",
      header: "Task Description",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },
    {
      accessorKey: "image",
      header: "Team Member",
      cell: (info) => (
        <UserAvatar
          name={info.row.original.name}
          email={info.row.original.email}
          image={info.getValue()}
        />
      ),
    },

    {
      accessorKey: "created_at",
      header: "Assign Date",
      cell: (info) => <SimpleTextCell value={formateDate(info.getValue())} />,
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: (info) => <SimpleTextCell value={formateDate(info.getValue())} />,
    },

    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => (
        <div className="w-max">
          <Chip
            variant="ghost"
            size="sm"
            value={info.getValue()}
            color={statusColors[info.getValue()] || "blue-gray"}
          />
        </div>
      ),
    },
  ];
  return (
    <div className="">
      <aside
        id="logo-sidebar"
        class="fixed top-0 left-0 z-0 w-72 h-screen pt-24  transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div class="h-full px-1 py-4 overflow-y-auto dark:bg-gray-50">
          <div className="border-b  border-gray-300">
            <Typography variant="h5" className="ps-3 pb-4">
              Teams
            </Typography>
          </div>
          <List>
            {teams.map(({ id, name, description }) => (
              <ListItem
                key={id}
                selected={id === selectedTeam}
                onClick={() => setSelectedTeam(id)}
              >
                <UserAvatar name={name} image={null} email={description} />
              </ListItem>
            ))}
          </List>
        </div>
      </aside>
      <div class="p-4 sm:ml-64 h-auto overflow-y-auto">
        <div className="ms-8">
          <div className="mb-0 flex items-center justify-between gap-8">
            <div>
              <Typography variant="h5" color="blue-gray">
                Tasks list
              </Typography>
              <Typography color="gray" className="mt-1 font-normal">
                See information about all tasks
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row"></div>
          </div>
          <div className="py-4">
            <DataTable columns={columns} data={taskData} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default AdminTask;
