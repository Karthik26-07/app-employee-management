import React, { useEffect, useState } from "react";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  CardFooter,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import AddEditEmployee from "./AddEdit";
import { UserApi } from "@/Api/UserApi";
import { showErrorToast } from "@/lib/utils/toasts";
import UserAvatar from "@/components/UserAvatar";
import SimpleTextCell from "@/components/SimpleTextCell";
import DataTable from "@/components/DataTable";

const EmployeePage = () => {
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
      accessorKey: "contact",
      header: "Contact",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },
    {
      accessorKey: "user_type",
      header: "User Type",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: (info) => <SimpleTextCell value={info.getValue()} />,
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: (info) => (
        <div className="w-max">
          <Chip
            variant="ghost"
            size="sm"
            value={info.getValue() ? "Active" : "Deactive"}
            color={info.getValue() ? "green" : "blue-gray"}
          />
        </div>
      ),
    },
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

  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const handleOpen = (employee = null) => {
    setCurrentEmployee(employee);
    setOpen((cur) => !cur);
  };

  const fetchData = async () => {
    try {
      const result = await UserApi.getUsers();
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
              Employees list
            </Typography>
            <Typography color="gray" className="mt-1 font-normal">
              See information about all employees
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button
              className="flex items-center gap-3"
              size="md"
              onClick={() => handleOpen(null)}
            >
              <UserPlusIcon strokeWidth={2} className="h-4 w-4" />
              Add Employee
            </Button>
            <AddEditEmployee
              handleOpen={handleOpen}
              open={open}
              fetchData={fetchData}
              type={currentEmployee ? "Edit" : "Add"}
              defaultValue={currentEmployee}
            />
          </div>
        </div>
      </CardHeader>
      <CardBody className="px-0">
        <DataTable columns={columns} data={data} />
      </CardBody>
      <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4" />
    </Card>
  );
};

export default EmployeePage;
