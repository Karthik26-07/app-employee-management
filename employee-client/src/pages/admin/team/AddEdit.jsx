import {
  Dialog,
  DialogHeader,
  DialogBody,
  Input,
  Typography,
  Button,
  IconButton,
  Select,
  Option,
  Avatar,
  Checkbox,
  Textarea,
  DialogFooter,
} from "@material-tailwind/react";
import { ROLES } from "../../../config/constants";
import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../../lib/utils/toasts";
import { ToastContainer } from "react-toastify";
import { TeamApi } from "../../../Api/TeamApi";
import user from "../../../assets/images/user.png";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TeamSchema } from "../../../schema/schemas";
import UserAvatar from "../../../components/UserAvatar";
const AddEditTeam = ({ open, handleOpen, fetchTeams }) => {
  const [checkedItems, setCheckedItems] = useState([]);

  const [data, setData] = useState({
    team_lead: [],
    employees: [],
  });

  const formContext = useForm({
    resolver: yupResolver(TeamSchema),
  });

  const fetchData = async () => {
    try {
      const result = await TeamApi.getUsers();
      if (result.data.length > 0) {
        let res = {
          team_lead: [],
          employees: [],
        };
        result.data.forEach((element) => {
          if (element.user_type === "TEAM_LEAD") {
            res.team_lead.push(element);
          } else {
            res.employees.push(element);
          }
        });
        setData(res);
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleCheckbox = (e) => {
    const { id, checked } = e.target;
    setCheckedItems((prevState) => {
      if (checked) {
        return [...prevState, id];
      } else {
        return prevState.filter((item) => item !== id);
      }
    });
  };

  const onSubmit = async (data) => {
    if (checkedItems.length > 0) {
      try {
        const formData = { team_members: checkedItems, ...data };
        const response = await TeamApi.createTeam(formData);
        showSuccessToast(response.message);
        setTimeout(() => {
          handleOpen();
          formContext.reset();
          fetchTeams();
        }, 3000);
      } catch (error) {
        showErrorToast(error.message);
      }
    } else {
      showErrorToast("Please select at least one team member");
    }
  };

  useEffect(() => {
    open && fetchData();
    setCheckedItems([]);
  }, [open]);

  return (
    <Dialog className="p-4" size="xxl" open={open} handler={handleOpen}>
      <DialogHeader className="justify-between">
        <Typography variant="h5" color="blue-gray">
          Create New Team
        </Typography>
        <IconButton color="gray" size="sm" variant="text" onClick={handleOpen}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </IconButton>
      </DialogHeader>

      <DialogBody className="overflow-y-scroll h-screen">
        <ToastContainer />

        <div className="grid grid-cols-2 gap-4 divide-x-2">
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <Typography variant="h5" color="blue-gray" className="">
                Select Team Members
              </Typography>
              {/* <Typography
                      as="a"
                      href="#"
                      variant="small"
                      color="blue"
                      className="font-bold"
                    >
                      View all
                    </Typography> */}
            </div>
            <div className="divide-y divide-gray-200">
              {data.employees.map(({ name, email, image, id }) => (
                <div
                  key={id}
                  className="flex items-center justify-between pb-3 pt-3 last:pb-0"
                >
                  <UserAvatar
                    key={id}
                    image={image}
                    name={name}
                    email={email}
                  />

                  <Checkbox id={id} ripple={true} onChange={handleCheckbox} />
                </div>
              ))}
            </div>
          </div>
          <div className="p-4">
            <div className="mb-5">
              <Controller
                name="team_lead"
                control={formContext.control}
                defaultValue=""
                render={({ field }) => (
                  <Select size="lg" label="Team Lead" {...field}>
                    {data.team_lead.map(({ id, name }) => (
                      <Option key={id} value={id}>
                        {name}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              <Typography variant="small" color="red" className="mt-1">
                {formContext.formState.errors.team_lead?.message}
              </Typography>
            </div>
            <div className="mb-5">
              <Input
                color="gray"
                label="Team Title"
                size="lg"
                {...formContext.register("name")}
              />
              <Typography variant="small" color="red" className="mt-1">
                {formContext.formState.errors.name?.message}
              </Typography>
            </div>
            <div className="mb-5">
              <Textarea
                label="Description"
                {...formContext.register("description")}
              />
              <Typography variant="small" color="red" className="mt-1">
                {formContext.formState.errors.description?.message}
              </Typography>
            </div>
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        <div className="flex flex-col md:flex-row gap-4 mt-8">
          <Button
            color="red"
            className="w-full lg:max-w-[15rem]"
            onClick={handleOpen}
          >
            Cancel
          </Button>
          <Button
            color="gray"
            className="w-full lg:max-w-[15rem]"
            type="submit"
            onClick={formContext.handleSubmit(onSubmit)}
          >
            Submit
          </Button>
        </div>
      </DialogFooter>
    </Dialog>
  );
};
export default AddEditTeam;
