import { Link } from 'react-router'
import BgWrapper from '~/components/common/bg-wrapper'
import PageHeader from '~/components/common/page-header'
import SizeChartList from '~/components/screens/size-chart/size-chart-list'
import { Button } from '~/components/ui/button'

type Props = {}


export default function SizeChart({}: Props) {

 
  return (
     <div>
      <PageHeader title="Size Chart">
        <div className="flex items-center gap-2 ">
          <Link to={'/size-charts/new'}>
           <Button variant={"secondary"} size={"sm"}>
              Add Size Chart
            </Button>
          </Link>
           
        </div>
      </PageHeader>
      <BgWrapper>
        <SizeChartList/>
      </BgWrapper>
    </div>
  )
}