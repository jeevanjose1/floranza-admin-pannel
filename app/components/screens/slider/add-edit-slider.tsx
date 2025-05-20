import { Save } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import MediaInput from "~/components/ui/media-input";
import ErrorMessage from "~/components/ui/error-message";
import { slider_schema } from "~/shared/validations";
import { useCreateSlider, useUpadteSlider } from "~/services/queries/slider";
import { toast } from "sonner";

type SliderFormValues = z.infer<typeof slider_schema>;

type Props = {
  children: ReactNode;
  data?: any;
  onSave?: (data: SliderFormValues) => void;
};

export default function AddEditSliderModal({ children, data, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const { mutateAsync: add, isPending: addPending } = useCreateSlider();
  const { mutateAsync: edit, isPending: editPending } = useUpadteSlider();

  const form = useForm<SliderFormValues>({
    resolver: zodResolver(slider_schema) as any,
    values: {
      title: data?.title || "",
      sub_title: data?.sub_title || "",
      show_btn: data?.is_btn === "YES" ? true : false || false,
      btn_title: data?.btn_title || "",
      btn_url: data?.btn_url || "",
      order: data?.order || "",
      media: data
        ? [
            {
              file: data?.image?.name,
              url: data?.image?.large,
            },
          ]
        : [],
    },
  });

  const { formState } = form;
  const showButton = form.watch("show_btn");

  const handleClose = () => {
    setOpen(false);
    form.reset();
  };

  const onSubmit = (values: SliderFormValues) => {
    const form_data = new FormData();
    form_data.append("headTitle", values.title);
    form_data.append("subTitle", values.sub_title);
    form_data.append("buttonShow", values.show_btn ? "1" : "0");
    form_data.append("buttonTitle", values.btn_title as string);
    form_data.append("buttonURl", values.btn_url as string);
    form_data.append("image", values.media?.[0]?.file);
    if (values.order) {
      form_data.append("display_order", values.order);
    }
    form_data.append("status", "1");

    if (data === undefined) {
      add(form_data, {
        onSuccess: (response) => {
          toast.success("Slider Added");
          handleClose();
        },
        onError: (error: any) => {
          console.log(error);
        },
      });
    } else {
      edit(
        { data: form_data, id: data?.id },
        {
          onSuccess: (response) => {
            toast.success("Slider Updated");
            handleClose();
          },
          onError: (error: any) => {
            console.log(error);
          },
        }
      );
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    form.setValue("show_btn", checked);

    // Clear button fields if checkbox is unchecked
    if (!checked) {
      form.setValue("btn_title", "");
      form.setValue("btn_url", "");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{data ? "Edit" : "Add"} Slider</DialogTitle>
        </DialogHeader>

        <div className="w-full px-4 py-2">
          <form
            onSubmit={form.handleSubmit(onSubmit as any)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Controller
                name="title"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="title"
                    placeholder="Enter slider title"
                    {...field}
                  />
                )}
              />
              <ErrorMessage error={formState.errors.title?.message} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sub_title">Subtitle</Label>
              <Controller
                name="sub_title"
                control={form.control}
                render={({ field }) => (
                  <Input
                    id="sub_title"
                    placeholder="Enter slider subtitle"
                    {...field}
                  />
                )}
              />
              <ErrorMessage error={formState.errors.sub_title?.message} />
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="show_btn"
                control={form.control}
                render={({ field }) => (
                  <Checkbox
                    id="show_btn"
                    defaultChecked={field.value}
                    onCheckedChange={(checked) => {
                      field.onChange(checked);
                      handleCheckboxChange(checked as boolean);
                    }}
                  />
                )}
              />
              <Label htmlFor="show_btn">Show Button</Label>
            </div>

            {showButton && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="btn_title">Button Title</Label>
                  <Controller
                    name="btn_title"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="btn_title"
                        placeholder="Enter button text"
                        {...field}
                      />
                    )}
                  />
                  <ErrorMessage error={formState.errors.btn_title?.message} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="btn_url">Button URL</Label>
                  <Controller
                    name="btn_url"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="btn_url"
                        placeholder="Enter button URL"
                        {...field}
                      />
                    )}
                  />
                  <ErrorMessage error={formState.errors.btn_url?.message} />
                </div>
              </>
            )}
            {data && (
              <div className="space-y-2">
                <Label htmlFor="order">Display order</Label>
                <Controller
                  name="order"
                
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="order"
                      type="number"
                      placeholder="Enter order"
                      {...field}
                    />
                  )}
                />
              </div>
            )}
            <div className="mb-5">
              <Label>Media</Label>
              <MediaInput form={form} />
              <ErrorMessage error={formState.errors.media?.message} />
            </div>

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
                type="submit"
                size="sm"
                className="gap-1"
                loading={addPending || editPending}
              >
                <Save className="h-3.5 w-3.5" />
                Save Slider
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
