import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogHeader,
  Typography,
  IconButton,
  DialogBody,
  Select,
  Option,
  Input,
  Textarea,
  Button,
} from "@material-tailwind/react";
import { Controller, useForm } from "react-hook-form";
import { ToastContainer } from "react-toastify";
import { LeaveApplicationSchema } from "../../../schema/schemas";
import { LEAVE_TYPES } from "../../../config/constants";
import { useEffect, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../../lib/utils/toasts";
import { LeaveApi } from "../../../Api/LeaveApi";

const AddEditLeave = ({ handleOpen, open, type, defaultValue, fetchData }) => {
  const [minDate, setMinDate] = useState({
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date().toISOString().split("T")[0],
  });

  const formContext = useForm({
    resolver: yupResolver(LeaveApplicationSchema),
  });

  const startDate = formContext.watch("start_date");

  useEffect(() => {
    setMinDate((prevState) => ({
      ...prevState,
      end_date: startDate,
    }));
    formContext.setValue("end_date", startDate);
  }, [startDate]);

  const onSubmit = async (data) => {
    try {
      const formData = { status: "Processing", ...data };
      const response = await LeaveApi.applyLeave(formData);
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
  return (
    <Dialog className="p-4" size="md" open={open} handler={handleOpen}>
      <DialogHeader className="justify-between">
        <Typography variant="h5" color="blue-gray">
          Leave Application
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
      <DialogBody>
        <ToastContainer />
        <form onSubmit={formContext.handleSubmit(onSubmit)}>
          <div className="my-4">
            <Controller
              name="leave_type"
              control={formContext.control}
              defaultValue=""
              render={({ field }) => (
                <Select size="lg" label="Leave Type" {...field}>
                  {LEAVE_TYPES.map((value, index) => (
                    <Option key={index} value={value}>
                      {value}
                    </Option>
                  ))}
                </Select>
              )}
            />
            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.leave_type?.message}
            </Typography>
          </div>
          <div className="my-4">
            <Input
              color="gray"
              label="Start Date"
              size="lg"
              className="w-full"
              type="date"
              min={minDate.start_date}
              {...formContext.register("start_date")}
            />

            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.start_date?.message}
            </Typography>
          </div>
          <div className="my-4">
            <Input
              color="gray"
              label="End Date"
              size="lg"
              className="w-full"
              type="date"
              min={minDate.end_date}
              {...formContext.register("end_date")}
            />

            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.end_date?.message}
            </Typography>
          </div>
          <div className="my-4">
            <Textarea
              label="Description(.optional)"
              {...formContext.register("description")}
            />
            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.description?.message}
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
export default AddEditLeave;
