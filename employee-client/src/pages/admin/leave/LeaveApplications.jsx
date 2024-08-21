import { PlusCircleIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Typography,
} from "@material-tailwind/react";

import UserAvatar from "@/components/UserAvatar";
import SimpleTextCell from "@/components/SimpleTextCell";
import DataTable from "@/components/DataTable";
import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../../lib/utils/toasts";
import { LeaveApi } from "../../../Api/LeaveApi";
import { formateDate } from "../../../lib/utils/custom";
const LeaveApplications = () => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    try {
      const response = await LeaveApi.adminLeaverApplication();
      setData(response.data);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleLeave = async (user, status) => {
    try {
      const formData = {
        id: user.id,
        status: status,
        leave_type: user.leave_type,
        total_days: user.total_days,
        user_id: user.user_id,
      };

      const response = await LeaveApi.handleLeaveApplication(formData);
      showSuccessToast(response.message);
      setTimeout(() => {
        fetchData();
      }, 3000);
    } catch (error) {
      showErrorToast(error.message);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
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
      accessorKey: "leave_type",
      header: "Leave Type",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: (info) => <SimpleTextCell value={formateDate(info.getValue())} />,
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: (info) => <SimpleTextCell value={formateDate(info.getValue())} />,
    },
    {
      accessorKey: "total_days",
      header: "Total Days",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: (info) => <SimpleTextCell value={info.getValue() || "--"} />,
    },
    // {
    //   accessorKey: "status",
    //   header: "Status",
    //   cell: (info) => (
    //     <div className="w-max">
    //       <Chip
    //         variant="ghost"
    //         size="sm"
    //         value={info.getValue()}
    //         color={info.getValue() ? "green" : "blue-gray"}
    //       />
    //     </div>
    //   ),
    // },
    {
      accessorKey: "id",
      header: "Action",
      cell: (info) => (
        <div className="flex gap-2">
          <Button
            variant="outlined"
            color="green"
            onClick={() => handleLeave(info.row.original, "Approved")}
          >
            Accept
          </Button>
          <Button
            variant="outlined"
            color="red"
            onClick={() => handleLeave(info.row.original, "Rejected")}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-0 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Leave Application list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all leave applications
            </Typography>
          </div>
          {/* <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              className="flex items-center gap-3"
              size="md"
              onClick={() => handleOpen(null)}
            >
              <PlusCircleIcon strokeWidth={2} className="h-4 w-4" />
              Add Leave
            </Button>
            <AddEditLeave
              defaultValue={currentLeave}
              fetchData={fetchData}
              handleOpen={handleOpen}
              open={open}
              type={currentLeave ? "Edit" : "Add"}
            />
          </div> */}
        </div>
      </CardHeader>
      <CardBody>
        <DataTable data={data} columns={columns} />
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4" />
    </Card>
  );
};
export default LeaveApplications;
