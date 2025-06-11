import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import ErrorMessage from "~/components/ui/error-message";
import { login_schema } from "~/shared/validations";
import { useLogin } from "~/services/queries";
import { toast } from "sonner";
import { useNavigate } from "react-router";


type LoginFormValues = z.infer<typeof login_schema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutate: login, isPending } = useLogin();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(login_schema),
  });

  const onSubmit = (values: LoginFormValues) => {
    const form_data = new FormData();
    form_data.append("email", values.email);
    form_data.append("password", values.password);

    login(form_data, {
      onSuccess: (response) => {
        if (response.data?.auth?.token) {
          localStorage.setItem(
            "token",
            JSON.stringify(response.data?.auth?.token)
          );
          localStorage.setItem("user", JSON.stringify(response.data?.user));
          toast.error(response?.message);
          navigate("/");
        }
      },
      onError: (error: any) => {
        toast.error(error.data?.message);
      },
    });
  };

  return (
    <div className={cn("flex w-80 flex-col gap-6", className)} {...props}>
      <Card className="bg-muted/20">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <div className="grid gap-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />

                <ErrorMessage error={errors.email && errors?.email.message} />
              </div>
              <div className="grid gap-1">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-[13px] hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                <ErrorMessage
                  error={errors.password && errors?.password.message}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  loading={isPending}
                  type="submit"
                  size={"sm"}
                  className="w-full"
                >
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
