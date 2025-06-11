import dayjs from "dayjs";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import AddEditUser from "~/components/screens/admin-users/add-edit-user";
import { AdminUsersTable } from "~/components/screens/admin-users/admin-user-table";
import AdminUserTableHeader from "~/components/screens/admin-users/admin-user-table-header";
import { Button } from "~/components/ui/button";
import { useListUser } from "~/services/queries/admin-users";

type Props = {};

export default function AdminUser({}: Props) {
  const { data: list_user, isFetching, isLoading } = useListUser({});

  const filtred_list = list_user?.data?.data?.map((item: any) => {
    return {
      id: item?.id,
      name: item?.name,
      email: item?.email,
      date: dayjs(item?.created_at).format("DD-MM-YYYY"),
      role: item?.role,
      status:item?.status
    };
  });

  return (
    <div>
      <PageHeader title="Admin Users">
        <div className="flex items-center gap-2 ">
          <AddEditUser>
            <Button variant={"secondary"} size={"sm"}>
              Add User
            </Button>
          </AddEditUser>
        </div>
      </PageHeader>
      <BgWrapper>
        <AdminUserTableHeader />
        <AdminUsersTable
          table_data={filtred_list}
          loading={isFetching || isFetching}
        />
      </BgWrapper>
    </div>
  );
}
