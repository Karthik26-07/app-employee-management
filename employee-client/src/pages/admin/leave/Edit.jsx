import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { LeaveSchema } from "../../../schema/schemas";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
  IconButton,
  Input,
  Button,
} from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import { useState, useEffect } from "react";
import { showErrorToast, showSuccessToast } from "../../../lib/utils/toasts";
import { LeaveApi } from "../../../Api/LeaveApi";
const EditLeave = ({ open, handleOpen, fetchData, defaultValue }) => {
  const [formDefault, setDefaultValue] = useState({
    sl: 0,
    cl: 0,
  });
  const formContext = useForm({
    resolver: yupResolver(LeaveSchema),
    defaultValues: formDefault,
  });

  const onSubmit = async (data) => {
    try {
      const formData = { id: defaultValue.id, ...data };
      const response = await LeaveApi.updateLeave(formData);
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
    if (open) {
      const { sl, cl } = defaultValue;
      const initialValues = {
        sl: sl || 0,
        cl: cl || 0,
      };
      setDefaultValue(initialValues);
    }
  }, [open, defaultValue]);

  useEffect(() => {
    formContext.reset(formDefault);
  }, [formDefault, formContext]);

  return (
    <Dialog className="p-4" size="md" open={open} handler={handleOpen}>
      <DialogHeader className="justify-between">
        <Typography variant="h5" color="blue-gray">
          Update Leaves
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
            <Input
              color="gray"
              label="Sick leave"
              size="lg"
              className="w-full md:max-w-lg"
              {...formContext.register("sl")}
            />
            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.el?.message}
            </Typography>
          </div>
          <div className="my-4">
            <Input
              color="gray"
              label="Casual leave"
              size="lg"
              className="w-full md:max-w-lg"
              {...formContext.register("cl")}
            />
            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.cl?.message}
            </Typography>
          </div>

          <div className="my-4 mt-6">
            <Button color="gray" className="w-full" type="submit">
              Update
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};
export default EditLeave;
