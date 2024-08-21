import { useEffect, useState } from "react";
import { SalaryApi } from "../../../Api/SalaryApi";
import { showErrorToast } from "../../../lib/utils/toasts";

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
import EditSalary from "./Edit";
import UserAvatar from "@/components/UserAvatar";
import SimpleTextCell from "@/components/SimpleTextCell";
import DataTable from "@/components/DataTable";

const SalaryPage = () => {
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
      accessorKey: "basic",
      header: "Basic",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },
    {
      accessorKey: "da",
      header: "Da",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },
    {
      accessorKey: "ta",
      header: "Ta",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },
    {
      accessorKey: "gross_salary",
      header: "Gross Salary",
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

  const [currentSalary, setCurrentSalary] = useState(null);

  const handleOpen = (salary = null) => {
    setCurrentSalary(salary);
    setOpen((cur) => !cur);
  };

  const fetchData = async () => {
    try {
      const response = await SalaryApi.getSalary();
      setData(response.data);
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
              Salary list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all salaries
            </Typography>
          </div>
        </div>
        <EditSalary
          defaultValue={currentSalary}
          fetchData={fetchData}
          handleOpen={handleOpen}
          open={open}
        />
      </CardHeader>
      <CardBody className=" px-0">
        <DataTable columns={columns} data={data} />
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4"></CardFooter>
    </Card>
  );
};

export default SalaryPage;
