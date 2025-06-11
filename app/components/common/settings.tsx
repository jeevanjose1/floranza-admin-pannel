import { type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ErrorMessage from "../ui/error-message";
import { profile_schema } from "~/shared/validations";
import { useGetProfile, useUpdateProfile } from "~/services/queries/auth";
import { toast } from "sonner";

type ProfileFormData = z.infer<typeof profile_schema>;

type Props = {
  children: ReactNode;
};

export default function Settings({ children }: Props) {
  const { data: profile, isLoading } = useGetProfile();
  const { mutateAsync: updated, isPending } = useUpdateProfile();
  const {
    control,
    handleSubmit,
    formState: { errors },

    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profile_schema),
    disabled: isLoading,
    values: {
      name: profile?.data?.user?.name || "",
      email: profile?.data?.user?.email || "",
      password: "",
    },
  });
console.log(errors);

  const onSubmit = (values: ProfileFormData) => {
    const form_data = new FormData();
    form_data.append("name", values.name);
    form_data.append("email", values.email);
    if(values.password !==''){
    form_data.append("password", values.password);

    }

    updated(form_data, {
      onSuccess: () => {
        toast.success("Profile updated");
      },
      onError: () => {
        toast.error("Profile updation failed");
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 px-4 pb-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Profile Information</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="name"
                    placeholder="Enter your full name"
                    className={errors.name ? "border-red-500" : ""}
                  />
                )}
              />
              <ErrorMessage error={errors?.name?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className={errors.email ? "border-red-500" : ""}
                  />
                )}
              />
              <ErrorMessage error={errors?.email?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className={errors.password ? "border-red-500" : ""}
                  />
                )}
              />
              <ErrorMessage error={errors?.password?.message} />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              size={"sm"}
              onClick={() => reset()}
            >
              Reset
            </Button>
            <Button type="submit" size={"sm"} loading={isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
