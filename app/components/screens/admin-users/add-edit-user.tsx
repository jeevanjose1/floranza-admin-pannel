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
import { admin_user_schema } from "~/shared/validations"; // You'll need to update this schema
import { useCreateUser, useUpadteUser } from "~/services/queries/admin-users";
import { toast } from "sonner";
import PermissionSelector from "./permission-selector";
import { ScrollArea } from "~/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { images } from "~/shared/images/image";

// Updated schema to include permissions
const extended_admin_user_schema = admin_user_schema

type UserFormData = z.infer<typeof extended_admin_user_schema>;

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
    setValue,

    watch
  } = useForm<UserFormData>({
    resolver: zodResolver(extended_admin_user_schema),
    values: {
      user_name: data?.name || "",
      email: data?.email || "",
      role: data?.role && String(data?.role) || "2",
      password: "",
      status: String(data?.status) || "Active",
      permissions: data?.permission ? JSON.parse(data?.permission) : [],
      is_edit: isEditMode,
      role_name: data?.role_name || ""
    },
  });

  const onSubmitForm = async (values: UserFormData) => {
    const form_data = new FormData();
    form_data.append("name", values.user_name);
    form_data.append("email", values.email);
    if (values?.password !== '') {
      form_data.append("password", values.password as string);

    }
    form_data.append("role", values.role);
    form_data.append("role_name", values.role_name);

    if (values.permissions && values.permissions.length > 0) {
      form_data.append("permission", JSON.stringify(values.permissions));
    }

    if (isEditMode) {
      form_data.append("status", values.status as string);
    }

    if (isEditMode) {
      update(
        { data: form_data, id: data?.id },
        {
          onSuccess: () => {
            toast.success("User updated successfully");
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
          toast.success("User added successfully");
          setOpen(false);
          reset()
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
      <DialogContent className="sm:max-w-3xl gap-0 max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Edit User" : "Add User"}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="w-full px-4 py-2 max-h-[80vh]">
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
              <Label htmlFor="password" className="text-sm font-medium">
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
              <ErrorMessage error={errors.password?.message} />
            </div>
            <div className="w-full mb-6">
              <Label htmlFor="role" className="text-sm font-medium">
                Role Name
              </Label>
              <Controller
                control={control}
                name="role_name"
                render={({ field }) => (
                  <Input
                    id="role_name"
                    {...field}
                    placeholder="Enter role name"
                    className="mt-1"
                  />
                )}
              />
              <ErrorMessage error={errors.role_name?.message} />
            </div>

            <div className="w-full mb-6">
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => (
                  <RadioGroup onValueChange={(e) => field.onChange(e)} defaultValue={field.value} >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2" id="staff" />
                      <img className="w-6 h-6" src={images.packing} alt="" />
                      <Label className="mb-0" htmlFor="staff">Packing Staff</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="3" id="shipping" />
                      <img className="w-6 h-6" src={images.shipping} alt="" />

                      <Label className="mb-0" htmlFor="shipping">Shipping Staff</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4" id="whatsapp" />
                      <img className="w-6 h-6" src={images.whatsapp} alt="" />

                      <Label className="mb-0" htmlFor="whatsapp">Whatsapp Order Staff</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="5" id="whatsapp_payment" />
                      <img className="w-6 h-6" src={images.varify} alt="" />

                      <Label className="mb-0" htmlFor="whatsapp_payment">Whatsapp Order Payment Verification</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="6" id="admin" />
                      <img className="w-6 h-6" src={images.sub_admin} alt="" />

                      <Label className="mb-0" htmlFor="admin">Sub Admin</Label>
                    </div>
                  </RadioGroup>
                )}
              />
              <ErrorMessage error={errors.role?.message} />
            </div>

            {/* Permission Selector */}
            <PermissionSelector
              control={control}
              name="permissions"
              label="Permissions"
              error={errors.permissions?.message}
              defaultValue={data?.permissions || []}
              setValue={setValue}
            />

            {isEditMode && (
              <div className="w-full mb-6">
                <Label htmlFor="status" className="text-sm font-medium">
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
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}