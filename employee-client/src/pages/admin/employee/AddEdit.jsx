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
  Checkbox,
  Textarea,
} from "@material-tailwind/react";
import { ROLES } from "../../../config/constants";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { UserApi } from "../../../Api/UserApi";
import { UserSchema } from "../../../schema/schemas";
import { showErrorToast, showSuccessToast } from "../../../lib/utils/toasts";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";

const AddEditEmployee = ({
  open,
  handleOpen,
  fetchData,
  type,
  defaultValue,
}) => {
  const [defaultVal, setDefaultValues] = useState({});

  const formContext = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues: defaultVal,
  });

  const onSubmit = async (data) => {
    try {
      let response = null;
      if (type == "Edit") {
        const formData = { id: defaultValue.id, ...data };
        response = await UserApi.updateUser(formData);
      } else {
        response = await UserApi.createUser(data);
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
      const { name, email, user_type, address, contact, is_active } =
        defaultValue;
      const initialValues = {
        name: name,
        email: email,
        user_type: user_type,
        address: address,
        contact: contact,
        is_active: is_active,
      };
      setDefaultValues(initialValues);
    }
  }, [open, defaultValue]);

  useEffect(() => {
    formContext.reset(defaultVal);
  }, [defaultVal, formContext]);
  return (
    <Dialog className="p-4" size="lg" open={open} handler={handleOpen}>
      <DialogHeader className="justify-between">
        <Typography variant="h5" color="blue-gray">
          Add Employee
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
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Input
                color="gray"
                label="Name"
                size="lg"
                className="w-full md:max-w-lg"
                {...formContext.register("name")}
              />
              <Typography variant="small" color="red" className="mt-1">
                {formContext.formState.errors.name?.message}
              </Typography>
            </div>
            <div>
              <Controller
                name="user_type"
                control={formContext.control}
                defaultValue=""
                render={({ field }) => (
                  <Select size="lg" label="Role" {...field}>
                    {ROLES.map(({ key, value }) => (
                      <Option key={key} value={key}>
                        {value}
                      </Option>
                    ))}
                  </Select>
                )}
              />
              <Typography variant="small" color="red" className="mt-1">
                {formContext.formState.errors.user_type?.message}
              </Typography>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-8 mb-8">
            <div>
              <Input
                color="gray"
                label="Email"
                size="lg"
                className="w-full md:max-w-lg"
                {...formContext.register("email")}
              />
              <Typography variant="small" color="red" className="mt-1">
                {formContext.formState.errors.email?.message}
              </Typography>
            </div>
            <div>
              <Input
                color="gray"
                label="Contact"
                size="lg"
                className="w-full md:max-w-lg"
                {...formContext.register("contact")}
              />
              <Typography variant="small" color="red" className="mt-1">
                {formContext.formState.errors.contact?.message}
              </Typography>
            </div>
          </div>
          <Textarea label="Address" {...formContext.register("address")} />
          <Typography variant="small" color="red" className="mt-1">
            {formContext.formState.errors.address?.message}
          </Typography>
          <div className="flex flex-col md:flex-row gap-2 mt-8 justify-between">
            <Controller
              name="is_active"
              control={formContext.control}
              render={({ field }) => (
                <Checkbox
                  id="is_active"
                  label="Is Active"
                  ripple={true}
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              )}
            />
            <Button
              color="gray"
              className="w-full lg:max-w-[15rem]"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </DialogBody>
    </Dialog>
  );
};

export default AddEditEmployee;
