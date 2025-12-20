'use client'
import dayjs from 'dayjs';
import { AlertTriangle, Clock, DollarSign, MoreHorizontal, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import Loader from '~/components/ui/loader';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Separator } from '~/components/ui/separator';
import { useGetDashboard, useGetProductDetails } from '~/services/queries/dashboard';


interface TopSellingProduct {
  product_id: string;
  product_name: string;
  total_qty: string;
  total_orders: number;
  total_revenue: string;
  image: string;
  image_url: string;
  is_variation: boolean
  sku:string
}

interface LowStockProduct {
  product_id: string;
  product_name: string;
  product_sku: string;
  is_variation: number;
  product_qty: number;
  variation_qty: number;
  variation_sale_price: string;
  attribute_option_name: string;
  image_url: string;
    sku:string

}

interface ChartDataPoint {
  name: string;
  orders: number;
  sales: number;
}

interface CategoryData {
  name: string;
  value: string;
  color: string;
}

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}



interface ProductRowProps {
  product: TopSellingProduct | LowStockProduct;
  showStock?: boolean;

}



// Transform chart data
const transformChartData = (labels: string[], totals: number[], sales: number[]): ChartDataPoint[] => {
  return labels?.map((label, index) => ({
    name: label,
    orders: totals[index],
    sales: sales[index]
  }));
};


// Calculate metrics
const calculateGrowth = (current: number, previous: number): string => {
  if (previous === 0) return current > 0 ? "100" : "0";
  return ((current - previous) / previous * 100).toFixed(1);
};



// Format currency
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};



const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, color }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
    <div className="absolute -right-4 -top-4 opacity-20">
      <Icon className="h-24 w-24" />
    </div>
    <div className="relative z-10">

      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-80">{title}</div>
    </div>
  </div>
);


const ProductRow: React.FC<ProductRowProps> = ({ product, showStock = false }) => {


  const isLowStockProduct = (product: TopSellingProduct | LowStockProduct): product is LowStockProduct => {
    return 'product_sku' in product;
  };

  return (
    <div className="flex items-center space-x-4 p-4 cursor-pointer bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <img
        src={product.image_url}
        alt={product.product_name}
        className="w-12 h-12 rounded-lg object-cover"
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          const target = e.target as HTMLImageElement;
          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iOCIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNMjQgMzJDMjguNDE4MyAzMiAzMiAyOC40MTgzIDMyIDI0QzMyIDE5LjU4MTcgMjguNDE4MyAxNiAyNCAxNkMxOS41ODE3IDE2IDE2IDE5LjU4MTcgMTYgMjRDMTYgMjguNDE4MyAxOS41ODE3IDMyIDI0IDMyWiIgZmlsbD0iI0Q1RDlERCIvPgo8L3N2Zz4K';
        }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 line-clamp-1">
          {product.product_name}
        </p>
        <p className="text-xs font-medium text-muted-foreground ">SKU: {product?.sku}</p>
        {showStock && isLowStockProduct(product) && product.product_sku && (
          <p className="text-xs text-gray-500">SKU: {product.product_sku}</p>
        )}
        {isLowStockProduct(product) && product.attribute_option_name && (
          <p className="text-xs text-gray-500">Size: {product.attribute_option_name}</p>
        )}
      </div>
      <div className="text-right">
        {showStock && isLowStockProduct(product) ? (
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-medium ${(product.variation_qty || product.product_qty) === 0 ? 'text-red-600' :
              (product.variation_qty || product.product_qty) <= 2 ? 'text-amber-600' : 'text-gray-900'
              }`}>
              Stock: {product.variation_qty || product.product_qty || 0}
            </span>
            {(product.variation_qty || product.product_qty) === 0 && (
              <AlertTriangle className="h-4 w-4 text-red-500" />
            )}
          </div>
        ) : (
          !isLowStockProduct(product) && (
            <>
              <p className="text-sm font-medium text-gray-900">
                {formatCurrency(parseFloat(product.total_revenue || "0"))}
              </p>
              <p className="text-xs text-gray-500">
                Qty: {product.total_qty} | Orders: {product.total_orders}
              </p>
              {!Boolean(product.is_variation ) && <p className="text-xs mt-1 italic text-blue-600">Click to view more details</p>}
            </>
          )
        )}
      </div>
    </div>
  );
};

const ProductDetails = ({ product, showStock = false, type }: { type: 'all' | 'today' | 'yesterday', showStock: any, product: any }) => {
  const [open, setOpen] = useState(false)
  const dateFilter = () => {
    let date: string | null = null;
    if (type === 'today') {
      date = dayjs().format('YYYY-MM-DD');
    } else if (type === 'yesterday') {
      date = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    }
    return {
      start_date: date,
      end_date: date,
    };
  };

  const { data: details, isLoading } = useGetProductDetails({
    id: product.product_id,
    filter: {
      start_date: dateFilter().start_date,
      end_date: dateFilter().end_date
    },
    disabled: open
  })
  const filtered = details ? details?.data?.slice(0, details?.data?.length - 1) : []

  return (!Boolean(product.is_variation)) ? <Dialog onOpenChange={setOpen} open={open} >
    <DialogTrigger onClick={() => setOpen(true)} disabled={!showStock} className='w-full text-start'><ProductRow product={product} showStock={showStock} /></DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>More Details</DialogTitle>


      </DialogHeader>
      {isLoading ? <div className='w-full h-56 flex items-center justify-center'>
        <Loader />
      </div > : <div className='space-y-2 p-4'>
        {filtered.map((item: any) => (
          <li
            key={item.variation_id}
            className="flex justify-between border p-3 rounded-lg"
          >
            <div className="text-sm">
              <p className="font-medium">
                {item.attribute_option_name || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">
                Qty Sold: {item.total_qty_sold}
              </p>
            </div>
            <div className="text-sm font-semibold">
              ₹{Number(item.total_sales).toLocaleString()}
            </div>
          </li>
        ))}
      </div>}
    </DialogContent>
  </Dialog> : <ProductRow product={product} showStock={showStock} />

}

const FloranzaDashboard: React.FC = () => {

  const { data: dashboard, isLoading } = useGetDashboard({})
  const [sellingTab, setSellingTab] = useState('all')
  const apiData = dashboard?.data
 

  const chartData: ChartDataPoint[] = transformChartData(
    apiData?.chart_month_order.labels,
    apiData?.chart_month_order.totals,
    apiData?.chart_month_order.sales
  );

  if (isLoading) {
    return <div className='w-ful h-screen flex items-center justify-center'>
      <Loader />
    </div>
  }

  return (
    <div className="min-h-screen ">
      <div className=" space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold  ">
              Floranza Fashion
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Your  business dashboard</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-full shadow-sm border">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Today's Sales"
            value={formatCurrency(apiData?.today.totalSales)}
            icon={DollarSign}
            color="from-emerald-500 to-teal-600"
          />
          <MetricCard
            title="Today's Orders"
            value={apiData?.today.orderCount.toString()}
            icon={ShoppingCart}
            color="from-blue-500 to-cyan-600"
          />
          <MetricCard
            title="This Month Revenue"
            value={formatCurrency(apiData?.month.totalSales)}
            icon={TrendingUp}
            color="from-violet-500 to-purple-600"
          />
          <MetricCard
            title="This Month Orders"
            value={apiData?.month.orderCount.toString()}
            icon={Package}
            color="from-rose-500 to-pink-600"
          />
        </div>

        {/* Charts Section */}
        <div className="gw-full">
          {/* Sales Trend Chart */}
          <Card className="xl:col-span-2 bg-white border-0" >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Sales & Orders Trends</CardTitle>
                  <CardDescription>Daily performance overview</CardDescription>
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </CardHeader>
            <CardContent className='px-4'>
              <ResponsiveContainer width="100%" height={320}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'sales' ? formatCurrency(value) : value,
                      name === 'sales' ? 'Sales' : 'Orders'
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                    name="sales"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="#EC4899"
                    strokeWidth={3}
                    fill="url(#ordersGradient)"
                    name="orders"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>


        </div>

        {/* Products and Stock Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Selling Products */}
          <Card className='bg-white border-0'>
            <CardHeader>
              <div className='flex items-center justify-between'>


                <div>
                  <CardTitle>Top Selling Products</CardTitle>
                  <CardDescription>Best performers this period</CardDescription>
                </div>
                <Select defaultValue='all' onValueChange={(e) => { setSellingTab(e) }}>
                  <SelectTrigger className="w-[180px] !h-8">
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent >
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="yesterday">Yesterday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardHeader>
            <CardContent>
              <ScrollArea className='h-150  ' >
                <div className="space-y-4 py-3">

                  {sellingTab === 'all' && apiData?.topSellingProducts?.map((product: any) => (
                    <ProductDetails type='all' key={`${product.product_id}`} product={product} showStock={true} />
                  ))}
                  {sellingTab === 'today' && apiData?.todaySellingProducts?.map((product: any) => (
                    <ProductDetails type='today' key={`${product.product_id}`} product={product} showStock={true} />
                  ))}
                  {sellingTab === 'yesterday' && apiData?.yesterdaySellingProducts?.map((product: any) => (
                    <ProductDetails type='yesterday' key={`${product.product_id}`} product={product} showStock={true} />
                  ))}
                </div>

              </ScrollArea>


            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card className='bg-white border-0'>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>Pre order </span>
                  </CardTitle>
                  <CardDescription>Best performers in preorder</CardDescription>
                </div>

              </div>
            </CardHeader>
            <CardContent>
                            <ScrollArea className='h-150  ' >

              <div className="space-y-4 ">
                {apiData?.preOrderSellingProducts?.map((product: any, index: number) => (
                  <ProductDetails type='all' key={`${product.product_id}-${index}`} product={product} showStock={true} />
                ))}
              </div></ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Summary */}
        <Card className='bg-white border-0'>
          <CardHeader>
            <CardTitle>Business Summary</CardTitle>
            <CardDescription>Key performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Option 1: Different colors for each card */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
                <div className="text-xl font-bold text-blue-600 mb-1">
                  {apiData?.yesterday.orderCount}
                </div>
                <div className="text-sm text-gray-600">Yesterday Orders</div>
                <Separator className='my-2 bg-muted' />
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {formatCurrency(apiData?.yesterday.totalSales)}
                </div>
              </div>

              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
                <div className="text-xl font-bold text-purple-600 mb-1">
                  {apiData?.week.orderCount}
                </div>
                <div className="text-sm text-gray-600">This Week Orders</div>
                <Separator className='my-2 bg-muted' />
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {formatCurrency(apiData?.week.totalSales)}
                </div>
              </div>

              {/* <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl">
                <div className="text-xl font-bold text-orange-600 mb-1">
                  {apiData?.month.orderCount}
                </div>
                <div className="text-sm text-gray-600">This Month Orders</div>
                <Separator className='my-2 bg-muted' />
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {formatCurrency(apiData?.month.totalSales)}
                </div>
              </div> */}

              <div className="text-center p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-xl">
                <div className="text-xl font-bold text-red-600 mb-1">
                  {apiData?.last_month.orderCount}
                </div>
                <div className="text-sm text-gray-600">Last Month Orders</div>
                <Separator className='my-2 bg-muted' />
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {formatCurrency(apiData?.last_month.totalSales)}
                </div>
              </div>
            </div>

            {/* Option 2: All cards with blue theme */}

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FloranzaDashboard;