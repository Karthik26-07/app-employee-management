import { yupResolver } from "@hookform/resolvers/yup";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  Typography,
  IconButton,
  Input,
  Button,
} from "@material-tailwind/react";
import { useForm } from "react-hook-form";
import { SalarySchema } from "../../../schema/schemas";
import { useState, useEffect } from "react";
import { showErrorToast, showSuccessToast } from "../../../lib/utils/toasts";
import { SalaryApi } from "../../../Api/SalaryApi";
import { ToastContainer } from "react-toastify";

const EditSalary = ({ open, handleOpen, fetchData, defaultValue }) => {
  const [formDefault, setDefaultValue] = useState({
    ta: 0,
    da: 0,
    basic: 0,
    gross_salary: 0,
  });

  const formContext = useForm({
    resolver: yupResolver(SalarySchema),
    defaultValues: formDefault,
  });

  const onSubmit = async (data) => {
    const formData = { id: defaultValue.id, ...data };
    try {
      const response = await SalaryApi.updateSalary(formData);
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

  const ta = formContext.watch("ta");
  const da = formContext.watch("da");
  const basic = formContext.watch("basic");

  useEffect(() => {
    const grossSalary = (ta || 0) + (da || 0) + (basic || 0);
    formContext.setValue("gross_salary", grossSalary);
  }, [ta, da, basic, formContext]);

  useEffect(() => {
    if (open) {
      const initialValues = {
        ta: defaultValue.ta || 0,
        da: defaultValue.da || 0,
        basic: defaultValue.basic || 0,
        gross_salary: defaultValue.gross_salary || 0,
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
          Update Salary
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
              label="Basic"
              size="lg"
              className="w-full md:max-w-lg"
              {...formContext.register("basic", { valueAsNumber: true })}
            />
            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.basic?.message}
            </Typography>
          </div>
          <div className="my-4">
            <Input
              color="gray"
              label="Da"
              size="lg"
              className="w-full md:max-w-lg"
              {...formContext.register("da", { valueAsNumber: true })}
            />
            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.da?.message}
            </Typography>
          </div>
          <div className="my-4">
            <Input
              color="gray"
              label="Ta"
              size="lg"
              className="w-full md:max-w-lg"
              {...formContext.register("ta", { valueAsNumber: true })}
            />
            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.ta?.message}
            </Typography>
          </div>
          <div className="my-4">
            <Input
              color="gray"
              label="Gross Salary"
              size="lg"
              className="w-full md:max-w-lg"
              readOnly={true}
              {...formContext.register("gross_salary", { valueAsNumber: true })}
            />
            <Typography variant="small" color="red" className="mt-1">
              {formContext.formState.errors.gross_salary?.message}
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

export default EditSalary;
