import { UserPlusIcon } from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Typography,
  Input,
  Textarea,
} from "@material-tailwind/react";
import { showErrorToast, showSuccessToast } from "../lib/utils/toasts";
import { UserApi } from "../Api/UserApi";
import { useEffect, useState } from "react";
import user from "../assets/images/user.png";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ProfileSchema } from "../schema/schemas";
import { API_URL } from "../config/env-helper";
import { setImage } from "../lib/utils/custom";
import SalaryChart from "../components/SalaryChart";
import { useAuth } from "../lib/hooks/useAuth";

const ProfilePage = () => {
  const [data, setData] = useState({});
  const [defaultValue, setDefaultValue] = useState({});
  const [salary, setSalary] = useState({
    basic: 0,
    da: 0,
    gross_salary: 0,
    ta: 0,
  });
  const { role } = useAuth();
  const formContext = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues: defaultValue,
  });

  const fetchData = async () => {
    try {
      const response = await UserApi.getUser();
      const data = response.data;

      setData(data.user);

      if (data.salary) {
        setSalary(data.salary);
      }
      const { contact, address, image } = data.user;
      const defVal = {
        contact: contact,
        address: address,
        image: image,
      };

      setImage(image);
      setDefaultValue(defVal);
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const onSubmit = async (formData) => {
    try {
      if (formData) {
        const formDataToSend = new FormData();
        formDataToSend.append("contact", formData.contact);
        formDataToSend.append("address", formData.address);

        if (formData.password) {
          formDataToSend.append("password", formData.password);
        }
        if (formData.image?.length) {
          formDataToSend.append("image", formData.image[0]);
        }

        const response = await UserApi.updateProfile(formDataToSend);
        showSuccessToast(response.message);
        setTimeout(() => {
          fetchData();
          formContext.reset();
        }, 3000);
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  useEffect(() => {
    formContext.reset(defaultValue);
  }, [defaultValue]);
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <>
      <form
        onSubmit={formContext.handleSubmit(onSubmit)}
        encType="multipart/form-data"
      >
        <Card className="h-full w-full" shadow={false}>
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="mb-0 flex items-center justify-between gap-8">
              <div>
                <Typography variant="h5" color="blue-gray">
                  User Profile
                </Typography>
                <Typography color="gray" className="mt-1 font-normal">
                  Update your profile
                </Typography>
              </div>
              <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                <Button
                  className="flex items-center gap-3"
                  size="md"
                  type="submit"
                  onClick={() => formContext.handleSubmit(onSubmit())}
                >
                  <UserPlusIcon strokeWidth={2} className="h-4 w-4" />
                  Update Profile
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="flex gap-4">
            <Card className="w-4/12 border border-gray-300" shadow={false}>
              <CardHeader
                floated={false}
                className="h-72 overflow-hidden relative"
              >
                <img
                  src={data.image ? API_URL + data.image : user}
                  alt="profile-picture"
                  className="absolute top-0 left-0 w-full h-full object-cover"
                />
              </CardHeader>
              <CardBody className="text-center">
                <Typography variant="h4" color="blue-gray" className="mb-2">
                  {data.name}
                </Typography>
                <Typography
                  color="blue-gray"
                  className="font-medium"
                  textGradient
                >
                  {data.user_type}
                </Typography>
                <Typography
                  color="blue-gray"
                  className="font-medium"
                  textGradient
                >
                  {data.email}
                </Typography>
              </CardBody>
            </Card>
            <div className="shrink w-full">
              <div className="grid grid-cols-2 gap-2 my-4">
                <div>
                  <Input
                    color="gray"
                    label="Image"
                    size="lg"
                    className="w-full md:max-w-lg"
                    type="file"
                    accept="image/*"
                    {...formContext.register("image")}
                  />

                  <Typography variant="small" color="red" className="mt-1">
                    {formContext.formState.errors.image?.message}
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
              <div className="my-4">
                <Textarea
                  label="Address"
                  {...formContext.register("address")}
                />
                <Typography variant="small" color="red" className="mt-1">
                  {formContext.formState.errors.address?.message}
                </Typography>
              </div>
              <div className="my-4">
                <Input
                  color="gray"
                  label="Password"
                  size="lg"
                  className="w-full"
                  {...formContext.register("password")}
                />
                <Typography variant="small" color="red" className="mt-1">
                  {formContext.formState.errors.password?.message}
                </Typography>
              </div>
              {role != "ADMIN" && (
                <div>
                  <Card shadow={false} className="border border-gray-300">
                    <CardBody>
                      <SalaryChart {...salary} />
                    </CardBody>
                  </Card>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </form>
    </>
  );
};

export default ProfilePage;
