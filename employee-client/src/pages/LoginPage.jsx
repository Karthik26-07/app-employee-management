import { useState } from "react";
import {
  Typography,
  Input,
  Button,
  Card,
  CardBody,
} from "@material-tailwind/react";
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../lib/hooks/useAuth";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema } from "../schema/schemas";
import { showErrorToast, showInfoToast } from "../lib/utils/toasts";
import { AuthApi } from "../Api/AuthApi";
import { ToastContainer } from "react-toastify";
import { setImage } from "../lib/utils/custom";

const LoginPage = () => {
  const [passwordShown, setPasswordShown] = useState(false);

  const { login } = useAuth();

  const formContext = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const formSubmit = async (formData) => {
    try {
      const response = await AuthApi.login(formData);
      const { role, image } = response.data;
      setImage(image);
      if (role == "ADMIN") {
        login(role, "/admin/task");
      } else {
        login(role, "/user/task");
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  return (
    <section className="grid text-center h-screen items-center justify-center p-8 bg-gradient-to-r from-purple-100 to-pink-200">
      <Card className="w-auto border-gray-700">
        <ToastContainer />
        <CardBody>
          <div>
            <Typography variant="h3" color="blue-gray" className="mb-2">
              Sign In
            </Typography>
            <Typography className="mb-16 text-gray-600 font-normal text-[18px]">
              Enter your email and password to sign in
            </Typography>
            <form
              action="#"
              className="mx-auto max-w-[24rem] text-left"
              onSubmit={formContext.handleSubmit(formSubmit)}
            >
              <div className="mb-6">
                <Input
                  type="email"
                  size="lg"
                  placeholder="Email Address"
                  label="Email"
                  name="email"
                  {...formContext.register("email")}
                  containerProps={{ className: "min-w-[100px]" }}
                />
                <Typography variant="small" color="red" className="mt-1">
                  {formContext.formState.errors.email?.message}
                </Typography>
              </div>
              <div className="mb-6">
                <Input
                  size="lg"
                  placeholder=""
                  label="Password"
                  name="password"
                  {...formContext.register("password")}
                  className="w-full placeholder:opacity-100 focus:border-t-primary border-t-blue-gray-200"
                  type={passwordShown ? "text" : "password"}
                  icon={
                    <i onClick={() => setPasswordShown((cur) => !cur)}>
                      {passwordShown ? (
                        <EyeIcon className="h-5 w-5" />
                      ) : (
                        <EyeSlashIcon className="h-5 w-5" />
                      )}
                    </i>
                  }
                />
                <Typography variant="small" color="red" className="mt-1">
                  {formContext.formState.errors.password?.message}
                </Typography>
              </div>
              <Button
                type="submit"
                color="gray"
                size="lg"
                className="mt-6"
                fullWidth
              >
                sign in
              </Button>
              <div className="!mt-4 flex justify-end">
                {/* <Typography
                  as="a"
                  href="#"
                  color="blue-gray"
                  variant="small"
                  className="font-medium"
                >
                  Forgot password ?
                </Typography> */}
              </div>
            </form>
          </div>
        </CardBody>
      </Card>
    </section>
  );
};
export default LoginPage;
