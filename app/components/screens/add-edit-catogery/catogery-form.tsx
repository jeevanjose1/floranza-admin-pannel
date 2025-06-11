import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { category_schema } from "~/shared/validations";
import {
  useCatogeryDetails,
  useCreateCatogery,
  useUpadteCatogery,
} from "~/services/queries";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { Checkbox } from "~/components/ui/checkbox";

type CategoryFormValues = z.infer<typeof category_schema>;

type Props = { id: string | undefined };

export default function CategoryForm({ id }: Props) {
  const { mutateAsync: add_catogery, isPending: add_pending } =
    useCreateCatogery();
  const { mutateAsync: edit_catogery, isPending: edit_pending } =
    useUpadteCatogery();
  const { data: catogery_data } = useCatogeryDetails(id as string);

  const navigate = useNavigate();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(category_schema),
    values: {
      description: catogery_data?.data?.description || "",
      image: catogery_data?.data?.image?.mini || null,
      name: catogery_data?.data?.name || "",
      // slug: catogery_data?.data?.slug || "",
      status: catogery_data?.data?.status === 1 ? "active" : "inactive",
      meta_title: catogery_data?.data?.meta_title || "",
      meta_description: catogery_data?.data?.meta_des || "",
      home_show: catogery_data?.data?.home_show === 1 ? true : false,
      nav_active: catogery_data?.data?.nav_active === 1 ? true : false,
      nav_order: catogery_data?.data?.nav_order || "",
      display_order: catogery_data?.data?.display_order || "",
    },
  });

  const { control, handleSubmit, formState } = form;

  const onSubmit = (values: CategoryFormValues) => {
    const form_data = new FormData();
    form_data.append("name", values.name);
    form_data.append("description", values.description);
    if (typeof values.image === "object") {
      form_data.append("image", values.image);
    }
    form_data.append("meta_title", values.meta_title);
    form_data.append("meta_des", values.meta_description);
    form_data.append("status", values.status === "active" ? "1" : "0");
    form_data.append("display_order", "1");
    form_data.append("home_show", values.home_show ? "1" : "0");
    form_data.append("nav_active", values.nav_active ? "1" : "0");
    form_data.append("nav_order", values.nav_order as string);

    if (id) {
      edit_catogery(
        { id: id, data: form_data },
        {
          onSuccess: (response) => {
            toast.success(response.message);
            navigate("/catogery");
          },
          onError: (error) => {
            toast.error("Something went wrong");
          },
        }
      );
    } else {
      add_catogery(form_data, {
        onSuccess: (response) => {
          toast.success(response.message);
          navigate("/catogery");
        },
        onError: (error) => {
          toast.success("Something went wrong");
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
              <div className="mb-4">
                <Label>Category Name</Label>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <Input type="text" {...field} placeholder="Catogery name" />
                  )}
                />
                <ErrorMessage error={formState.errors.name?.message} />
              </div>

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
              <div className="mb-3">
                <Label>Meta title</Label>
                <Controller
                  control={form?.control}
                  name="meta_title"
                  render={({ field }) => {
                    return <Input {...field} type="text" placeholder="Title" />;
                  }}
                />
                <ErrorMessage error={formState.errors.meta_title?.message} />
              </div>
              <div className="mb-3">
                <Label>Meta description</Label>
                <Controller
                  control={form?.control}
                  name="meta_description"
                  render={({ field }) => {
                    return (
                      <Textarea
                        {...field}
                        className="resize-none"
                        placeholder="Description"
                      />
                    );
                  }}
                />
                <ErrorMessage
                  error={formState.errors.meta_description?.message}
                />
              </div>
              <div>
                <Label>Display order</Label>
                <Controller
                  control={control}
                  name="display_order"
                  render={({ field }) => (
                    <Input
                      type="number"
                      placeholder="Enter display order"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
          </BgWrapper>

          <div className="ml-auto">
            <Button
              type="submit"
              loading={add_pending || edit_pending}
              variant="secondary"
            >
              {id ? "Update" : "Add"}
            </Button>
          </div>
        </div>

        <div className="flex-1/12 flex flex-col gap-3 sticky top-12">
          <BgWrapper>
            <div className="p-4 w-full">
              <div className="mb-4">
                <h1 className="text-sm font-semibold mb-2">Status</h1>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
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
          <BgWrapper>
            <div className="p-4 w-full">
              <h1 className="text-sm font-semibold mb-2">Menu options</h1>

              <div className="mb-4 flex items-center gap-2">
                <Controller
                  control={control}
                  name="home_show"
                  render={({ field }) => (
                    <Checkbox
                      checked={field.value}
                      id="home_show"
                      onCheckedChange={(e) => field.onChange(e)}
                    />
                  )}
                />
                <Label htmlFor="home_show" className="text-sm mb-0 ">
                  Show this category in home
                </Label>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <Controller
                  control={control}
                  name="nav_active"
                  render={({ field }) => (
                    <Checkbox
                      id="nav_active"
                      checked={field.value}
                      onCheckedChange={(e) => field.onChange(e)}
                    />
                  )}
                />
                <Label htmlFor="nav_active" className="text-sm  mb-0">
                  Show this category in menu
                </Label>
              </div>
              {form.watch("nav_active") && (
                <div>
                  <Controller
                    control={control}
                    name="nav_order"
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Enter menu order"
                        {...field}
                      />
                    )}
                  />
                  <ErrorMessage error={formState.errors.status?.message} />
                </div>
              )}
              {/* <div>
								<h1 className="text-sm font-semibold mb-2">Parent Category</h1>
								<Controller
									control={control}
									name="categories"
									render={({ field }) => (
										<Combobox
											options={[
												{ value: "electronics", label: "Electronics" },
												{ value: "fashion", label: "Fashion" },
											]}
											value={field.value}
											onChange={field.onChange}
											multiple
										/>
									)}
								/>
								<ErrorMessage error={formState.errors.categories?.message} />
							</div> */}
            </div>
          </BgWrapper>
        </div>
      </form>
    </div>
  );
}
