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

import SimpleTextCell from "@/components/SimpleTextCell";
import DataTable from "@/components/DataTable";
import { useState } from "react";
import AddEditLeave from "./AddEdit";
import { showErrorToast, showSuccessToast } from "../../../lib/utils/toasts";
import { LeaveApi } from "../../../Api/LeaveApi";
import { formateDate } from "../../../lib/utils/custom";
import { statusColors } from "../../../config/constants";

const UserLeavePage = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentLeave, setCurrentLeave] = useState({});
  const [leavesCount, setLeaveCounts] = useState({});

  const handleOpen = (leave = null) => {
    setCurrentLeave(leave);
    setOpen((cur) => !cur);
  };

  const fetchData = async () => {
    try {
      const response = await LeaveApi.getAppliedLeave();
      setData(response.data.leaves);
      setLeaveCounts(response.data.leave_counts[0]);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handelCancel = async (id) => {
    try {
      const formData = { id: id };
      const response = await LeaveApi.cancelLeave(formData);
      showSuccessToast(response.message);
      fetchData();
    } catch (error) {
      showErrorToast(error.message);
    }
  };
  useState(() => {
    fetchData();
  }, []);
  const columns = [
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
      cell: (info) => (
        <div>
          {info.row.original.status == "Processing" && (
            <Button
              variant="outlined"
              color="red"
              onClick={() => handelCancel(info.getValue())}
            >
              Cancel
            </Button>
          )}
        </div>
      ),
    },
  ];
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-0 flex items-center justify-between gap-8">
          <div>
            {/* <Typography variant="h5" color="blue-gray">
              Leaves list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all leaves
            </Typography> */}
            <div className="flex gap-4 ">
              <LeaveCountsCard
                title={"Total Available Leaves"}
                value={leavesCount.total_leaves}
              />
              <LeaveCountsCard
                title={"Total Available CL"}
                value={leavesCount.cl}
              />
              <LeaveCountsCard
                title={"Total Available SL"}
                value={leavesCount.sl}
              />
            </div>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              className="flex items-center gap-3"
              size="md"
              onClick={() => handleOpen(null)}
            >
              <PlusCircleIcon strokeWidth={2} className="h-4 w-4" />
              Apply Leave
            </Button>
            <AddEditLeave
              defaultValue={currentLeave}
              fetchData={fetchData}
              handleOpen={handleOpen}
              open={open}
              type={currentLeave ? "Edit" : "Add"}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody>
        <DataTable data={data} columns={columns} />
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4" />
    </Card>
  );
};
export default UserLeavePage;

function LeaveCountsCard({ title, value }) {
  return (
    <Card className="shadow-sm border border-gray-200 !rounded-lg w-64">
      <CardBody className="p-5">
        <div className="flex justify-between items-center">
          <Typography className="!font-medium !text-xs text-gray-600">
            {title}
          </Typography>
        </div>
        <Typography color="blue-gray" className="mt-1 font-bold text-xl">
          {value} days
        </Typography>
      </CardBody>
    </Card>
  );
}
