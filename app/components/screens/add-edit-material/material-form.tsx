import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import BgWrapper from "~/components/common/bg-wrapper";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import ErrorMessage from "~/components/ui/error-message";
import { Textarea } from "~/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import MediaUpload from "~/components/ui/media-upload";
import {
  useCreateMaterial,
  useMaterialDetails,
  useUpadteMaterial,
} from "~/services/queries";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { material_schema } from "~/shared/validations";

type MaterialFormValues = z.infer<typeof material_schema>;

type Props = { id: string | undefined };

export default function MaterialForm({ id }: Props) {
  const { mutateAsync: add_material, isPending: add_pending } = useCreateMaterial();
  const { mutateAsync: edit_material, isPending: edit_pending } = useUpadteMaterial();
  const { data: material_data } = useMaterialDetails(id as string);
  const navigate = useNavigate();

  const { control, handleSubmit, formState } = useForm<MaterialFormValues>({
    resolver: zodResolver(material_schema),
    values: {
      title: material_data?.data?.name || "",
      description: material_data?.data?.description || "",
      image: material_data?.data?.image?.mini || null,
      // slug: material_data?.data?.slug || "",
      meta_title: material_data?.data?.meta_title || "",
      meta_description: material_data?.data?.meta_des || "",
      status: material_data?.data?.status === 1 ? "active" : "inactive",
    },
  });

  const onSubmit = (values: MaterialFormValues) => {
    const form_data = new FormData();
    form_data.append("name", values.title);
    // form_data.append("slug", values.slug);
    form_data.append("description", values.description as string);
    if (typeof values.image === "object") {
      form_data.append("image", values.image);
    }
    form_data.append("meta_title", values.meta_title as string);
    form_data.append("meta_des", values.meta_description as string);
    form_data.append("status", values.status === "active" ? "1" : "0");
    form_data.append("display_order", "1");

    if (id) {
      edit_material(
        { id: id, data: form_data },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            navigate("/materials");
          },
          onError: (error: any) => {
            toast.error("Something went wrong");
          },
        }
      );
    } else {
      add_material(form_data, {
        onSuccess: (response) => {
          toast.success(response.message);
          navigate("/materials");
        },
        onError: (error: any) => {
          toast.error("Something went wrong");
        },
      });
    }
  };

  return (
    <div className="container-md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full gap-3">
        <div className="flex-1/2 grid gap-3">
          <BgWrapper>
            <div className="p-4">
              {/* Title */}
              <div className="mb-4">
                <Label>Material Name</Label>
                <Controller
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <Input {...field} placeholder="Name" />
                  )}
                />
                <ErrorMessage error={formState.errors.title?.message} />
              </div>

              {/* Description */}
              <div className="mb-4">
                <Label>Description</Label>
                <Controller
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="resize-none h-28"
                      placeholder="Description"
                    />
                  )}
                />
                <ErrorMessage error={formState.errors.description?.message} />
              </div>

              {/* Image */}
              <div className="mb-4">
                <Label>Image</Label>
                <Controller
                  control={control}
                  name="image"
                  render={({ field }) => (
                    <MediaUpload
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <ErrorMessage error={formState.errors.image?.message as any} />
              </div>

              {/* Slug */}
              {/* <div className="mb-4">
                <Label>Slug</Label>
                <Controller
                  control={control}
                  name="slug"
                  render={({ field }) => (
                    <Input {...field} placeholder="Slug" />
                  )}
                />
                <ErrorMessage error={formState.errors.slug?.message} />
              </div> */}

          
              {/* Meta Title */}
              <div className="mb-3">
                <Label>Meta Title</Label>
                <Controller
                  control={control}
                  name="meta_title"
                  render={({ field }) => (
                    <Input {...field} placeholder="Meta Title" />
                  )}
                />
                <ErrorMessage error={formState.errors.meta_title?.message} />
              </div>

              {/* Meta Description */}
              <div className="mb-3">
                <Label>Meta Description</Label>
                <Controller
                  control={control}
                  name="meta_description"
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      className="resize-none"
                      placeholder="Meta Description"
                    />
                  )}
                />
                <ErrorMessage
                  error={formState.errors.meta_description?.message}
                />
              </div>
            </div>
          </BgWrapper>

          {/* Submit Button */}
          <div className="ml-auto">
            <Button
              loading={add_pending || edit_pending}
              type="submit"
              variant={"secondary"}
            >
              {id ? "Update" : "Add"}
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex-1/12 flex flex-col gap-3 sticky top-12">
          <BgWrapper>
            <div className="p-4 w-full">
              <div className="mb-4">
                <h1 className="text-sm font-semibold">Status</h1>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        size="sm"
                        className="w-full rounded-sm py-0"
                      >
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <ErrorMessage error={formState.errors.status?.message} />
              </div>
            </div>
          </BgWrapper>
        </div>
      </form>
    </div>
  );
}
