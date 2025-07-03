import { Link } from 'react-router'
import BgWrapper from '~/components/common/bg-wrapper'
import PageHeader from '~/components/common/page-header'
import PermissionWrapper from '~/components/common/permission-wrapper'
import SizeChartList from '~/components/screens/size-chart/size-chart-list'
import { Button } from '~/components/ui/button'
import { permission_loader } from '~/lib/utils'

export const clientLoader = ()=> permission_loader('size_charts:view')


export default function SizeChart() {


  return (
    <div>
      <PageHeader title="Size Chart">
        <PermissionWrapper permission='size_charts:create'>
          <div className="flex items-center gap-2 ">
            <Link to={'/size-charts/new'}>
              <Button variant={"secondary"} size={"sm"}>
                Add Size Chart
              </Button>
            </Link>
          </div>
        </PermissionWrapper>

      </PageHeader>
      <BgWrapper>
        <SizeChartList />
      </BgWrapper>
    </div>
  )
}