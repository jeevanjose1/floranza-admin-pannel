import dayjs from "dayjs";
import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import PermissionWrapper from "~/components/common/permission-wrapper";
import AddEditUser from "~/components/screens/admin-users/add-edit-user";
import { AdminUsersTable } from "~/components/screens/admin-users/admin-user-table";
import AdminUserTableHeader from "~/components/screens/admin-users/admin-user-table-header";
import { Button } from "~/components/ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useListUser } from "~/services/queries/admin-users";

export const clientLoader = ()=> permission_loader('admin_users:view')


export default function AdminUser() {
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();
  const {
    data: list_user,
    isFetching,
    isLoading,
  } = useListUser({
    page: query_params.page,
    keyword: query_params.search,
    tole: query_params.status,
    role: query_params.role,
  });

  const filtred_list = list_user?.data?.data?.map((item: any) => {
    return {
      id: item?.id,
      name: item?.name,
      email: item?.email,
      date: dayjs(item?.created_at).format("DD-MM-YYYY"),
      role: item?.role,
      status: item?.status,
      permission:item?.permission,
      role_name:item?.role_name
    };
  });

  return (
    <div>
      <PageHeader title="Admin Users">
        <PermissionWrapper permission="admin_users:create">
          <div className="flex items-center gap-2 ">
            <AddEditUser>
              <Button variant={"secondary"} size={"sm"}>
                Add User
              </Button>
            </AddEditUser>
          </div>
        </PermissionWrapper>

      </PageHeader>
      <BgWrapper>
        <AdminUserTableHeader />
        <AdminUsersTable
          is_next={list_user?.data?.next_page_url}
          current_page={list_user?.data?.current_page}
          is_previous={list_user?.data?.prev_page_url}
          table_data={filtred_list}
          loading={isFetching || isLoading}
        />
      </BgWrapper>
    </div>
  );
}
