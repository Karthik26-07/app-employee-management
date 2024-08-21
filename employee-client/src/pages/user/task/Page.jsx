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
import {
  CodeBracketSquareIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

import AddEditTask from "./AddEdit";

import UserAvatar from "@/components/UserAvatar";
import DataTable from "@/components/DataTable";
import SimpleTextCell from "@/components/SimpleTextCell";

import { showErrorToast } from "@/lib/utils/toasts";
import { formateDate } from "@/lib/utils/custom";

import { TeamApi } from "@/Api/TeamApi";
import { TaskApi } from "@/Api/TaskApi";
import { useAuth } from "../../../lib/hooks/useAuth";
import { statusColors } from "../../../config/constants";
import { showSuccessToast } from "../../../lib/utils/toasts";

const TaskPage = () => {
  const [selectedTeam, setSelectedTeam] = useState();
  const [teams, setTeams] = useState([]);
  const [taskData, setTaskData] = useState([]);
  const [currentTask, setCurrentTask] = useState({});
  const [open, setOpen] = useState(false);
  const { isTeamLead, role } = useAuth();

  const fetchData = async () => {
    try {
      let response;
      if (isTeamLead()) {
        response = await TeamApi.getTeamsByLead();
      } else {
        response = await TeamApi.getTeamsByMember();
      }
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

  const taskStatus = async (task, status) => {
    try {
      const formData = { id: task.id, status: status };
      await TaskApi.updateTaskStatus(formData);
      fetchTask();
      showSuccessToast("Successfully updated");
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const deleteTask = async (data) => {
    try {
      await TaskApi.deleteTask(data);
      showSuccessToast("Successfully deleted");
      fetchTask();
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleOpen = (task = null) => {
    setCurrentTask(task);
    setOpen((cur) => !cur);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchTask();
  }, [selectedTeam]);

  const columns = [
    {
      accessorKey: "image",
      header: isTeamLead() ? "Team Member" : "Team Lead",
      cell: (info) => (
        <UserAvatar
          name={info.row.original.name}
          email={info.row.original.email}
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
    {
      accessorKey: "id",
      header: "Action",
      cell: (info) =>
        isTeamLead() ? (
          <>
            {info.row.original.status != "Completed" && (
              <div>
                <Tooltip content="Edit Task">
                  <IconButton
                    variant="text"
                    onClick={() => handleOpen(info.row.original)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </IconButton>
                </Tooltip>
                <Tooltip content="Delete">
                  <IconButton
                    size="sm"
                    variant="text"
                    className="border-red-300 "
                    color="red"
                    onClick={() => deleteTask({ id: info.getValue() })}
                  >
                    <TrashIcon strokeWidth={2} className="h-4 w-4" />
                  </IconButton>
                </Tooltip>
              </div>
            )}

            {info.row.original.status === "Pending Review" && (
              <div className="flex gap-2">
                <Button
                  className="flex items-center gap-3"
                  size="sm"
                  color="green"
                  onClick={() => taskStatus(info.row.original, "Completed")}
                >
                  Accept
                </Button>
                <Button
                  className="flex items-center gap-3"
                  size="sm"
                  color="red"
                  onClick={() => taskStatus(info.row.original, "Rejected")}
                >
                  Reject
                </Button>
              </div>
            )}
          </>
        ) : info.row.original.status === "Not Started" ? (
          <Button
            className="flex items-center gap-3"
            size="sm"
            onClick={() => taskStatus(info.row.original, "In Progress")}
          >
            Start
          </Button>
        ) : info.row.original.status === "In Progress" ||
          info.row.original.status === "Rejected" ? (
          <Button
            className="flex items-center gap-3"
            size="sm"
            color="cyan"
            onClick={() => taskStatus(info.row.original, "Pending Review")}
          >
            Update
          </Button>
        ) : (
          <Button
            className="flex items-center gap-3"
            size="sm"
            color={
              info.row.original.status === "Completed" ? "green" : "deep-purple"
            }
            disabled
          >
            {info.row.original.status}
          </Button>
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
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              {isTeamLead() && (
                <>
                  <Button
                    className="flex items-center gap-3"
                    size="md"
                    onClick={() => handleOpen(null)}
                  >
                    <CodeBracketSquareIcon
                      strokeWidth={2}
                      className="h-4 w-4"
                    />
                    Assign Task
                  </Button>
                  <AddEditTask
                    open={open}
                    handleOpen={handleOpen}
                    fetchData={fetchTask}
                    defaultValue={currentTask}
                    team_id={selectedTeam}
                    type={currentTask ? "Edit" : "Add"}
                  />
                </>
              )}
            </div>
          </div>
          <div className="py-4">
            <DataTable columns={columns} data={taskData} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default TaskPage;
