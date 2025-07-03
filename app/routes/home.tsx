'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { DollarSign, ShoppingCart, TrendingUp, Users, Package, Clock } from 'lucide-react';
import BgWrapper from '~/components/common/bg-wrapper';
import { permission_loader } from '~/lib/utils';

export const clientLoader = ()=> permission_loader('home:view')

const salesData = [
  { name: 'Jan', sales: 4000, revenue: 24000 },
  { name: 'Feb', sales: 3000, revenue: 18000 },
  { name: 'Mar', sales: 5000, revenue: 30000 },
  { name: 'Apr', sales: 4500, revenue: 27000 },
  { name: 'May', sales: 6000, revenue: 36000 },
  { name: 'Jun', sales: 5500, revenue: 33000 },
];

const dailySales = [
  { day: 'Mon', orders: 45 },
  { day: 'Tue', orders: 52 },
  { day: 'Wed', orders: 38 },
  { day: 'Thu', orders: 61 },
  { day: 'Fri', orders: 55 },
  { day: 'Sat', orders: 67 },
  { day: 'Sun', orders: 43 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#8884d8' },
  { name: 'Clothing', value: 25, color: '#82ca9d' },
  { name: 'Books', value: 20, color: '#ffc658' },
  { name: 'Home & Garden', value: 15, color: '#ff7c7c' },
  { name: 'Others', value: 5, color: '#8dd1e1' },
];

const latestOrders = [
  {
    id: '#12345',
    customer: 'John Doe',
    product: 'iPhone 15 Pro',
    amount: '$999.00',
    status: 'Completed',
    date: '2025-06-12',
  },
  {
    id: '#12346',
    customer: 'Jane Smith',
    product: 'MacBook Air',
    amount: '$1,299.00',
    status: 'Processing',
    date: '2025-06-12',
  },
  {
    id: '#12347',
    customer: 'Mike Johnson',
    product: 'AirPods Pro',
    amount: '$249.00',
    status: 'Shipped',
    date: '2025-06-11',
  },
  {
    id: '#12348',
    customer: 'Sarah Wilson',
    product: 'iPad Pro',
    amount: '$799.00',
    status: 'Pending',
    date: '2025-06-11',
  },
  {
    id: '#12349',
    customer: 'Tom Brown',
    product: 'Apple Watch',
    amount: '$399.00',
    status: 'Completed',
    date: '2025-06-10',
  },
];

const MetricCard = ({ title, value, change, icon: Icon, trend }:any) => (
  <Card className="relative overflow-hidden bg-white rounded-md border-0">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className={`text-xs flex items-center mt-1 ${
        trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'
      }`}>
        <TrendingUp className={`mr-1 h-3 w-3 ${trend === 'down' ? 'rotate-180' : ''}`} />
        {change} from yesterday
      </p>
    </CardContent>
  </Card>
);

type OrderStatus = 'Completed' | 'Processing' | 'Shipped' | 'Pending';

const StatusBadge = ({ status }: { status: OrderStatus }) => {
  const statusConfig: Record<OrderStatus, string> = {
    Completed: 'bg-green-100 text-green-800',
    Processing: 'bg-blue-100 text-blue-800',
    Shipped: 'bg-purple-100 text-purple-800',
    Pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <Badge className={statusConfig[status] || 'bg-gray-100 text-gray-800'}>
      {status}
    </Badge>
  );
};

export default function Home() {
  return (
    <BgWrapper className="w-full ">
      <div className=" space-y-4 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your store today.</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Today's Sales"
            value="₹45,231"
            change="+12.5%"
            icon={DollarSign}
            trend="up"
          />
          <MetricCard
            title="Total Sales"
            value="₹2,54,890"
            change="+8.2%"
            icon={ShoppingCart}
            trend="up"
          />
          <MetricCard
            title="Total Revenue"
            value="₹12,45,670"
            change="+15.3%"
            icon={TrendingUp}
            trend="up"
          />
          <MetricCard
            title="Active Users"
            value="1,247"
            change="-2.1%"
            icon={Users}
            trend="down"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sales Trend Chart */}
          <Card className='bg-white rounded-md border-0'>
            <CardHeader>
              <CardTitle>Sales & Revenue Trend</CardTitle>
              <CardDescription>Monthly sales and revenue overview</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="sales" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Sales"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#82ca9d" 
                    strokeWidth={2}
                    name="Revenue (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Orders Chart */}
          <Card className='bg-white rounded-md border-0'>
            <CardHeader>
              <CardTitle>Daily Orders</CardTitle>
              <CardDescription>Orders received this week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#8884d8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Second Row Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Distribution */}
          <Card className='bg-white rounded-md border-0'>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
              <CardDescription>Distribution of sales across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="lg:col-span-2 bg-white rounded-md border-0">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
              <CardDescription>Key performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                  <Package className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-blue-600">1,247</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                  <ShoppingCart className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Orders Today</p>
                    <p className="text-2xl font-bold text-green-600">89</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">New Customers</p>
                    <p className="text-2xl font-bold text-purple-600">23</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold text-orange-600">3.2%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Orders Table */}
        <Card className='bg-white rounded-md border-0'>
          <CardHeader>
            <CardTitle>Latest Orders</CardTitle>
            <CardDescription>Recent orders from your customers</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {latestOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell className="font-semibold">{order.amount}</TableCell>
                    <TableCell>
                      <StatusBadge status={order.status as any} />
                    </TableCell>
                    <TableCell>{order.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </BgWrapper>
  );
}