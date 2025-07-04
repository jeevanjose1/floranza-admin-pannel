import { useState } from "react";
import { toast } from "sonner";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import PermissionWrapper from "~/components/common/permission-wrapper";
import MediaList from "~/components/screens/media/media-list";
import MediaListHeader from "~/components/screens/media/media-list-header";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useListMedia, useUploadMedia } from "~/services/queries";
export const clientLoader = ()=> permission_loader('media:view')

export type MediaProp = { id: string; url: string; file: string };
export default function Media() {
  const { mutateAsync: upload } = useUploadMedia();
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();
  const {
    data: media_data,
    isFetching,
    isLoading,
  } = useListMedia({
    keyword: query_params.search,
    type: query_params.type,
    date: query_params.date,
  });
  const [select, setSelected] = useState<MediaProp[]>([]);
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("file", file);
    });

    toast.promise(upload(formData), {
      loading: "Uploading...",
      success: "Upload successful!",
      error:(error:any)=> error?.data?.message
,
    });
  };

  const filtred_media =
    media_data?.data?.data?.map((item: any) => {
      return {
        name: item?.file_name,
        url: item?.url,
        id: item?.id,
        size: item?.size,
        date: item?.created_at,
        type: item?.file?.split(".")[item?.file?.split(".")?.length - 1],
      };
    }) || [];

  return (
    <div>
      <PageHeader title="Materials">
        <PermissionWrapper permission="media:create">
          <label
            htmlFor="upload_media"
            className="flex items-center gap-2  cursor-pointer"
          >
            <Input
              multiple
              onChange={handleUpload}
              id="upload_media"
              hidden
              type="file"
            />
            <Button
              variant={"secondary"}
              className="pointer-events-none"
              size={"sm"}
            >
              Upload media
            </Button>
          </label>
        </PermissionWrapper>
      </PageHeader>
      <BgWrapper>
        <MediaListHeader select={select} setSelect={setSelected} />
        <MediaList
          setSelect={setSelected}
          select={select}
          media_data={filtred_media}
          loading={isFetching || isLoading}
        />
      </BgWrapper>
    </div>
  );
}
