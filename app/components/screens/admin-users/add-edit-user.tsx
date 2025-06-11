import { Save } from "lucide-react";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import ErrorMessage from "~/components/ui/error-message";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { admin_user_schema } from "~/shared/validations";
import { useCreateUser, useUpadteUser } from "~/services/queries/admin-users";
import { toast } from "sonner";

type UserFormData = z.infer<typeof admin_user_schema>;

type Props = {
  data?: any;
  children: React.ReactNode;
};

export default function AddEditUser({ data, children }: Props) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: add, isPending: addPending } = useCreateUser();
  const { mutateAsync: update, isPending: editPending } = useUpadteUser();

  const isEditMode = !!data;

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserFormData>({
    resolver: zodResolver(admin_user_schema),
    values: {
      user_name: data?.name || "",
      email: data?.email || "",
      role: String(data?.role) || "",
      password: "",
      status: String(data?.status) || "Active",
      is_edit: isEditMode,
    },
  });

  const onSubmitForm = async (values: UserFormData) => {
    const form_data = new FormData();
    form_data.append("name", values.user_name);
    form_data.append("email", values.email);
    form_data.append("password", values.password as string);
    form_data.append("role", values.role);
    if (isEditMode) {
      form_data.append("status", values.status as string);
    }
    if (isEditMode) {
      update(
        { data: form_data, id: data?.id },
        {
          onSuccess: () => {
            toast.success("User added success");
            setOpen(false);
          },
          onError: (error: any) => {
            toast.error(error?.data?.message);
          },
        }
      );
    } else {
      add(form_data, {
        onSuccess: () => {
          toast.success("User added success");
          setOpen(false);
        },
        onError: (error: any) => {
          toast.error(error?.data?.message);
        },
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>

        <div className="w-full px-4 py-2">
          <form onSubmit={handleSubmit(onSubmitForm)}>
            {/* User Name Field */}
            <div className="mb-4">
              <Label htmlFor="user_name" className="text-sm font-medium">
                User Name
              </Label>
              <Controller
                control={control}
                name="user_name"
                render={({ field }) => (
                  <Input
                    id="user_name"
                    {...field}
                    placeholder="Enter user name"
                    className="mt-1"
                  />
                )}
              />
              <ErrorMessage error={errors.user_name?.message} />
            </div>

            <div className="mb-4">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Controller
                control={control}
                name="email"
                render={({ field }) => (
                  <Input
                    id="email"
                    type="email"
                    {...field}
                    placeholder="Enter email address"
                    className="mt-1"
                  />
                )}
              />
              <ErrorMessage error={errors.email?.message} />
            </div>

            <div className="mb-4">
              <Label htmlFor="passowrd" className="text-sm font-medium">
                Password
              </Label>
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    id="password"
                    type="password"
                    {...field}
                    placeholder="Password"
                    className="mt-1"
                  />
                )}
              />
              <ErrorMessage error={errors.email?.message} />
            </div>

            <div className="w-full mb-6">
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="py-1 rounded-sm w-full" size="sm">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="2">Packing Staff</SelectItem>
                        <SelectItem value="3">Shipping Staff</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <ErrorMessage error={errors.role?.message} />
            </div>

            {isEditMode && (
              <div className="w-full mb-6">
                <Label htmlFor="status" className="text-xs font-medium">
                  Status
                </Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="py-1 rounded-sm w-full"
                        size="sm"
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="1">Active</SelectItem>
                          <SelectItem value="0">Inactive</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorMessage error={errors.status?.message} />
              </div>
            )}

            <DialogFooter
              onClick={(e) => e.stopPropagation()}
              className="border-t pt-4 mt-4"
            >
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClose}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                loading={addPending || editPending}
                type="submit"
                size="sm"
                className="gap-1"
              >
                <Save className="h-3.5 w-3.5" />
                Save
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
