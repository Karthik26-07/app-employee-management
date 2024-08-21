import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Typography,
  Input,
  Textarea,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import { Controller, useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { TaskSchema } from "../../../schema/schemas";
import { TASK_STATUS } from "../../../config/constants";
import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../../lib/utils/toasts";
import { TeamApi } from "../../../Api/TeamApi";
import { TaskApi } from "../../../Api/TaskApi";
import { customDateFormate } from "../../../lib/utils/custom";

const AddEditTask = ({
  open,
  handleOpen,
  team_id,
  type,
  defaultValue,
  fetchData,
}) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [defaultVal, setDefaultValues] = useState({
    status: "Not Started",
  });

  const formContext = useForm({
    resolver: yupResolver(TaskSchema),
    defaultValues: defaultVal,
  });

  const fetchTeamMembers = async () => {
    try {
      const params = { team_id: team_id };
      const response = await TeamApi.getTeamMembers(params);
      setTeamMembers(response.data);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  useEffect(() => {
    open && fetchTeamMembers();
  }, [open, team_id]);
  const onSubmit = async (data) => {
    try {
      let response;

      if (type == "Edit") {
        const formData = { task_id: defaultValue.id, ...data };
        response = await TaskApi.updateTask(formData);
      } else {
        // const formData = { team_id: team_id, ...data };
        // console.log(team_id);
        data.team_id = team_id;
        response = await TaskApi.createTask(data);
      }

      showSuccessToast(response.message);
      setTimeout(() => {
        handleOpen();
        formContext.reset();
        fetchData();
      }, 3000);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  useEffect(() => {
    if (type === "Edit") {
      const {
        team_id,
        user_id,
        task_title,
        task_description,
        status,
        end_date,
      } = defaultValue;
      const initialValues = {
        team_id: team_id,
        member_id: user_id,
        task_title: task_title,
        task_description: task_description,
        status: status,
        end_date: customDateFormate(end_date),
      };
      setDefaultValues(initialValues);
    }
  }, [open, defaultValue]);

  useEffect(() => {
    formContext.reset(defaultVal);
  }, [defaultVal, formContext]);

  return (
    <Dialog
      className="p-4 overflow-auto"
      size="md"
      open={open}
      handler={handleOpen}
    >
      <DialogHeader className="justify-between">
        <Typography variant="h5" color="blue-gray">
          Task
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
      <DialogBody className="overflow-auto">
        <ToastContainer />
        <form onSubmit={formContext.handleSubmit(onSubmit)}>
          <div className="my-4">
            <Controller
              name="member_id"
              control={formContext.control}
              defaultValue=""
              render={({ field }) => (
                <Select size="lg" label="Team Member" {...field}>
                  {teamMembers.map(({ id, name }) => (
                    <Option key={id} value={`${id}`}>
                      {name}
                    </Option>
                  ))}
                </Select>
              )}
            />
            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.member_id?.message}
            </Typography>
          </div>
          <div className="my-4">
            <Input
              color="gray"
              label="Task Title"
              size="lg"
              className="w-full"
              {...formContext.register("task_title")}
            />
            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.task_title?.message}
            </Typography>
          </div>
          <div className="my-4">
            <Textarea
              label="Task Description"
              {...formContext.register("task_description")}
            />
            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.task_description?.message}
            </Typography>
          </div>
          <div className="my-4 " hidden>
            {/* <Input
              color="gray"
              label=""
              size="lg"
              className="w-full"
              hidden={true}
              {...formContext.register("status")}
            /> */}
            {/* <Controller
              name="status"
              control={formContext.control}
              defaultValue={type == "Add" && TASK_STATUS[0]}
              disabled={type == "Add"}
              render={({ field }) => (
                <Select
                  size="lg"
                  label="Status"
                  {...field}
                  value={type == "Add" && TASK_STATUS[0]}
                >
                  {TASK_STATUS.map((task) => (
                    <Option key={task} value={task}>
                      {task}
                    </Option>
                  ))}
                </Select>
              )}
            /> */}
            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.status?.message}
            </Typography>
          </div>
          <div className="my-4">
            <Input
              color="gray"
              label="End Date"
              size="lg"
              className="w-full"
              type="date"
              {...formContext.register("end_date")}
            />

            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.end_date?.message}
            </Typography>
          </div>
          <div className="my-4 mt-6">
            <Button color="gray" className="w-full" type="submit">
              Save
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};
export default AddEditTask;
