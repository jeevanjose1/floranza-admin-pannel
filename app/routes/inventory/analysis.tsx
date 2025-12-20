
import { Package, TrendingUp, ShoppingCart, Users} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Badge } from '~/components/ui/badge';
import { useAnalysis } from '~/services/queries/product';
import {  useParams, useSearchParams } from 'react-router';
import PageHeader from '~/components/common/page-header';
import BgWrapper from '~/components/common/bg-wrapper';
import { AnalysisTable } from '~/components/screens/analysis/analysis-table';
import useQueryParams from '~/hooks/use-query-param';





const StatCard = ({ icon: Icon, title, value, subtitle }: any) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                    {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                </div>
                <div className="h-8 w-8 text-muted-foreground">
                    <Icon className="h-8 w-8" />
                </div>
            </div>
        </CardContent>
    </Card>
);


export default function Analysis() {
    const params = useParams()
    const [searchParams] = useSearchParams()
    const { getAllParams } = useQueryParams();
    const query_params = getAllParams();
    const { data, isLoading } = useAnalysis({
        product_id: params?.product_id,
        filter: {
            page: query_params.page,
            prd_var_value_id: searchParams.get('prd_var_value_id')

        }
    });
    const order_data = data?.data?.data?.map((item: any) => {
        return {
            id: item?.order_id,
            customer: item?.name,
            order_no: item?.order_no,
            sku: item?.sku,
            product_variation: item?.product_variation,
            qty: item?.qty,
            price: item?.price,
            order_status: item?.order_status,
            created_at: item?.created_at,
            is_pre_order: item?.is_pre_order
        }
    })

    if (isLoading) {
        return (
            <div className='p-4'>
                <PageHeader title="Analysis" />
                <BgWrapper>
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </BgWrapper>
            </div>
        );
    }

    if (!data?.success || !data?.data) {
        return (
            <div className='p-4'>
                <PageHeader title="Analysis" />
                <BgWrapper>
                    <Card>
                        <CardContent className="p-12 text-center">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No analysis data available</p>
                        </CardContent>
                    </Card>
                </BgWrapper>
            </div>
        );
    }

    const { product, data: orders, total } = data.data;

    return (
        <div className='px-4'>
            <PageHeader title="Product Analysis" />
            <BgWrapper className='bg-transparent border-0 shadow-none'>
                <div className="max-w-7xl mx-auto bg-transparent space-y-4">
                    {/* Product Overview Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Product Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-shrink-0">
                                    <img
                                        src={product.product_images?.[0]?.large}
                                        alt={product.product_name}
                                        className="w-32  object-cover rounded-lg border"
                                    />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <h2 className="text-xl font-semibold">{product.product_name}</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">SKU</p>
                                            <Badge variant="outline">{product.product_sku}</Badge>
                                        </div>
                                       {product.product_variation&& <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Variation</p>
                                            <Badge variant="secondary">{product.product_variation}</Badge>
                                        </div>}
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Stock Qty</p>
                                            <p className="font-medium">
                                                {product.is_unlimited_qty ? (
                                                    <Badge variant="default">Unlimited</Badge>
                                                ) : (
                                                    product.product_qty
                                                )}
                                            </p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">Sold Qty</p>
                                            <p className="font-medium">{product.sellQty}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard
                            icon={TrendingUp}
                            title="Total Revenue"
                            value={`₹${product.totalRevenue.toLocaleString()}`}
                            subtitle="Gross revenue generated"
                        />
                        <StatCard
                            icon={ShoppingCart}
                            title="Units Sold"
                            value={product.sellQty}
                            subtitle="Total quantity sold"
                        />
                        <StatCard
                            icon={Package}
                            title="Stock Level"
                            value={product.is_unlimited_qty ? '∞' : product.product_qty}
                            subtitle={product.is_unlimited_qty ? 'Unlimited inventory' : 'Current stock'}
                        />
                        <StatCard
                            icon={Users}
                            title="Total Orders"
                            value={total}
                            subtitle="Number of orders placed"
                        />
                    </div>



                    {/* Orders Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Recent Orders
                            </CardTitle>
                        </CardHeader>
                        <CardContent className='p-0'>
                            {orders.length > 0 ? (
                                <AnalysisTable table_data={order_data} is_next={data?.data?.next_page_url}
                                    current_page={data?.data?.current_page}
                                    is_previous={data?.data?.prev_page_url}
                                    loading={isLoading}
                                    total_page={Math.ceil(data?.data?.total / data?.data?.per_page)} />
                            ) : (
                                <div className="text-center py-12">
                                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No orders found for this product</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </BgWrapper>
        </div>
    );
}