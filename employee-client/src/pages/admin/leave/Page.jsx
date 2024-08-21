import { PencilIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { showErrorToast } from "@/lib/utils/toasts";
import { LeaveApi } from "@/Api/LeaveApi";
import EditLeave from "./Edit";
import UserAvatar from "@/components/UserAvatar";
import SimpleTextCell from "@/components/SimpleTextCell";
import DataTable from "@/components/DataTable";

const LeavePage = () => {
  const columns = [
    {
      accessorKey: "image",
      header: "User",
      cell: (info) => (
        <UserAvatar
          name={info.row.original.name}
          email={info.row.original.email}
          image={info.getValue()}
        />
      ),
    },
    {
      accessorKey: "user_type",
      header: "Role",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },
    {
      accessorKey: "cl",
      header: "Casual Leaves",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },
    {
      accessorKey: "sl",
      header: "Sick Leaves",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },

    {
      accessorKey: "total_leaves",
      header: "Total Leaves",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },

    // {
    //   accessorKey: "is_active",
    //   header: "Status",
    //   cell: (info) => (
    //     <div className="w-max">
    //       <Chip
    //         variant="ghost"
    //         size="sm"
    //         value={info.getValue() ? "Active" : "Deactive"}
    //         color={info.getValue() ? "green" : "blue-gray"}
    //       />
    //     </div>
    //   ),
    // },
    {
      accessorKey: "action",
      header: "Action",
      cell: (info) => (
        <Tooltip content="Edit User">
          <IconButton
            variant="text"
            onClick={() => handleOpen(info.row.original)}
          >
            <PencilIcon className="h-4 w-4" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);

  const [currentLeave, setCurrentLeave] = useState(null);

  const handleOpen = (leave = null) => {
    setCurrentLeave(leave);
    setOpen((cur) => !cur);
  };

  const fetchData = async () => {
    try {
      const result = await LeaveApi.getLeaves();
      setData(result.data);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-0 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Leave list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all leaves
            </Typography>
          </div>
        </div>
        <EditLeave
          defaultValue={currentLeave}
          fetchData={fetchData}
          handleOpen={handleOpen}
          open={open}
        />
      </CardHeader>
      <CardBody className="px-0">
        <DataTable columns={columns} data={data} />
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4"></CardFooter>
    </Card>
  );
};
export default LeavePage;
