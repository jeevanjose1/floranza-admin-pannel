import { Copy, Edit, Eye, Trash } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';
import PermissionWrapper from '~/components/common/permission-wrapper';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog';
import Loader from '~/components/ui/loader';
import { PopConfirm } from '~/components/ui/pop-confirm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { useCloneChart, useDeleteChart, useListChart } from '~/services/queries/size-chart';

type CardProps = { data: any }

const ChartCard = ({ data }: CardProps) => {
    const { mutateAsync: remove, isPending } = useDeleteChart()
    const { mutateAsync: clone, isPending: clonePending } = useCloneChart()

    const status = Boolean(data?.status) ? 'Active' : 'Inactive'
    const statusStyles: Record<string, string> = {
        Active: "bg-emerald-50 border-emerald-200 text-emerald-700 shadow-sm",
        Inactive: "bg-rose-50 border-rose-200 text-rose-700 shadow-sm",
    };
    const style = statusStyles[status] || "";
    const table_data = JSON.parse(data?.jsonData) || []
    const head = table_data?.[0]
    const rows = table_data?.slice(1)

    const handleDelete = () => {
        toast.promise(remove(data.id), {
            loading: 'Removing Chart',
            success: 'Chart Removed',
            error: (error) => {
                return error?.data?.message

            }
        })
    }
    const handleClone = () => {
        toast.promise(clone(data.id), {
            loading: 'Cloning Chart',
            success: 'Chart Clonned',
            error: (error) => {
                return error?.data?.message

            }
        })
    }
    return (
        <div className="group relative">
            <div className="bg-white border border-gray-200 rounded-md  transition-all duration-200 overflow-hidden">
                {/* Header Section */}
                <div className="p-5 pb-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="text-sm font-semibold text-gray-900 leading-tight break-all pr-2">
                            {data?.name}
                        </h3>
                        <Badge
                            variant="default"
                            className={`${style} text-xs font-medium px-2.5 py-1  border`}
                        >
                            {status}
                        </Badge>
                    </div>

                    {/* Chart Preview Info */}
                    <div className="text-xs text-gray-500 mb-4">
                        {table_data.length > 0 && (
                            <span>
                                {head?.length || 0} columns • {rows?.length || 0} rows
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions Section */}
                <div className="px-5 py-4 bg-muted/20 border-t border-gray-100">
                    <div className="flex items-center justify-center gap-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                >
                                    <Eye className="h-4 w-4 mr-1.5" />
                                    View
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                    <DialogTitle className="text-lg font-semibold">
                                        Size Chart - {data?.name}
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="w-full px-4 pt-2 pb-4 max-h-96 overflow-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                {head?.map((item: string, index: number) => (
                                                    <TableHead key={index}>{item}</TableHead>
                                                ))}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {rows?.map((item: any, index: number) => (
                                                <TableRow key={index}>
                                                    {item?.map((sub: any, subIndex: number) => (
                                                        <TableCell
                                                            key={`${index}-${subIndex}`}
                                                            className="font-medium !text-xs"
                                                        >
                                                            {sub}
                                                        </TableCell>
                                                    ))}
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <PermissionWrapper permission='size_charts:edit'>
                            <Link to={`/size-charts/edit/${data?.id}`}>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                                >
                                    <Edit className="h-4 w-4 mr-1.5" />
                                    Edit
                                </Button>
                            </Link>
                        </PermissionWrapper>
                        <PermissionWrapper permission='size_charts:clone'>

                            <PopConfirm
                                title="Clone chart"
                                description="Are you really want to clone this chart"
                                action={handleClone}
                            >
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-3 text-green-600 hover:text-green-800 hover:bg-green-50"
                                    disabled={isPending}
                                >
                                    <Copy className="h-4 w-4 mr-1.5" />
                                    Clone
                                </Button>
                            </PopConfirm>
                        </PermissionWrapper>
                        <PermissionWrapper permission='size_charts:delete'>

                            <PopConfirm
                                title="Remove chart"
                                description="Are you really want to remove this chart"
                                action={handleDelete}
                            >
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 px-3 text-red-600 hover:text-red-800 hover:bg-red-50"
                                    disabled={isPending}
                                >
                                    <Trash className="h-4 w-4 mr-1.5" />
                                    Delete
                                </Button>
                            </PopConfirm>
                        </PermissionWrapper>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default function SizeChartList() {
    const { data: size_chart, isLoading } = useListChart({})
    const chart_data = size_chart?.data?.data || []
    if (!Boolean(chart_data?.length)) {
        return <div className="p-6 w-full h-50 flex items-center justify-center">

            <p className='text-sm'>Size chart not found</p>
        </div>
    }
    return (
        <div className="p-6 w-full">
            {isLoading ? <div className='w-full h-50 flex items-center justify-center'>
                <Loader />
            </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {chart_data?.map((item: any) => (
                    <ChartCard key={item?.id} data={item} />
                ))}
            </div>}
        </div>
    )
}