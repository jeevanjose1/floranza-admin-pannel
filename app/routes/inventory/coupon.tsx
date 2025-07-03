import BgWrapper from "~/components/common/bg-wrapper";
import PageHeader from "~/components/common/page-header";
import PermissionWrapper from "~/components/common/permission-wrapper";
import AddEditModal from "~/components/screens/coupon/add-edit-coupon";
import { CouponList } from "~/components/screens/coupon/coupon-list";
import CouponListHeader from "~/components/screens/coupon/coupon-list-header";

import { Button } from "~/components/ui/button";
import useQueryParams from "~/hooks/use-query-param";
import { permission_loader } from "~/lib/utils";
import { useListCoupon } from "~/services/queries/coupon";

export const clientLoader = ()=> permission_loader('coupons:view')

export default function Coupon() {
  const { getAllParams } = useQueryParams();
  const query_params = getAllParams();
  const {
    data: coupon_data,
    isLoading,
    isFetching,
  } = useListCoupon({
    page: query_params.page,
    keyword: query_params.search,
    status: query_params.status,
    date: query_params.date,
    per_page: 10
  });

  const filtred_supplier =
    coupon_data?.data?.data?.map((item: any) => {
      return {
        id: item?.id,
        code: item?.code,
        amount: item?.amount,
        status: item?.status === 1 ? "Active" : "Inactive",
        date: item?.expiry_date,
        is_used: item?.is_used,


      };
    }) || [];

  return (
    <div>
      <PageHeader title="Coupon">
        <PermissionWrapper permission="coupons:create">
          <div className="flex items-center gap-2 ">
            <AddEditModal>
              <Button variant={"secondary"} size={"sm"}>
                Add Coupon
              </Button>
            </AddEditModal>
          </div>
        </PermissionWrapper>

      </PageHeader>
      <BgWrapper>
        <CouponListHeader />
        <CouponList
          is_next={coupon_data?.data?.next_page_url}
          current_page={coupon_data?.data?.current_page}
          is_previous={coupon_data?.data?.prev_page_url}
          table_data={filtred_supplier}
          loading={isFetching || isLoading}
        />
      </BgWrapper>
    </div>
  );
}
