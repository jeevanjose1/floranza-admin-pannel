import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import type { z } from 'zod'
import { Plus, Trash2 } from 'lucide-react'
import { size_chart_schema } from '~/shared/validations'
import BgWrapper from '~/components/common/bg-wrapper'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import ErrorMessage from '~/components/ui/error-message'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { useChartDetails, useCreateChart, useUpadteChart } from '~/services/queries/size-chart'
import { toast } from 'sonner'
import { useNavigate, useParams } from 'react-router'



type SizeChartFormValue = z.infer<typeof size_chart_schema>;

export default function SizeChartForm() {
    const params = useParams()
    const { data: chart_details } = useChartDetails(params?.chart_id as string)
    const table_data = chart_details ? JSON.parse(chart_details?.data?.jsonData) : null

    const head = table_data?.[0] || null
    const rows = table_data?.slice(1) || null
    const navigate = useNavigate()
    const { mutateAsync: add, isPending: addPending } = useCreateChart()
    const { mutateAsync: edit, isPending: editPending } = useUpadteChart()

    const { control, handleSubmit, formState, getValues, setValue } = useForm<SizeChartFormValue>({
        resolver: zodResolver(size_chart_schema),
        values: {
            name: chart_details?.data?.name || "",
            head: head || ['Size', 'Chest', 'Waist'],
            row: rows || [
                ['S', '36"', '30"'],
                ['M', '38"', '32"'],
                ['L', '40"', '34"']
            ],
            status: Boolean(chart_details?.data?.status) ? 'active' : 'inactive'
        },
    })

    const headArray = useFieldArray({ name: 'head', control })
    const rowArray = useFieldArray({ name: 'row', control })

    const handleAddColumn = () => {
        headArray.append('')
        const currentRows = getValues('row')
        const updatedRows = currentRows.map(row => [...row, ''])
        setValue('row', updatedRows)
    }

    const handleAddRow = () => {
        rowArray.append(Array(1).fill(''))
    }

    const handleRemoveColumn = (index: number) => {
        if (headArray.fields.length <= 1) return
        headArray.remove(index)
        const currentRows = getValues('row')
        const updatedRows = currentRows.map(row => row.filter((_: any, i: number) => i !== index))
        setValue('row', updatedRows)
    }

    const handleRemoveRow = (index: number) => {
        if (rowArray.fields.length <= 1) return
        rowArray.remove(index)
    }

    const onSubmit = (data: SizeChartFormValue) => {
        const size_data = [data.head, ...data.row]

        if (params?.chart_id) {
            edit({
                id: params?.chart_id,
                data: {
                    name: data.name,
                    jsonData: size_data,
                    status: data.status === 'active' ? 1 : 0
                }

            }, {
                onSuccess: () => {
                    toast.success('Size chart updated')
                    navigate('/size-charts')
                },
                onError: (error:any) => {
            toast.error(error.data?.message);
                }
            })
        } else {
            add({
                name: data.name,
                jsonData: size_data
            }, {
                onSuccess: () => {
                    toast.success('Size chart added')
                    navigate('/size-charts')
                },
                onError: (error:any) => {
            toast.error(error.data?.message);
                }
            })
        }

    }

    return (
        <div >
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-6">
                {/* Main Content */}
                <div className="flex-1/2  space-y-6">
                    <BgWrapper>
                        <div className="p-6">
                            {/* Chart Name */}
                            <div className="mb-6">
                                <Label htmlFor="chart-name">Chart Name</Label>
                                <Controller
                                    control={control}
                                    name="name"
                                    render={({ field }) => (
                                        <Input {...field} placeholder="Enter chart name" id="chart-name" />
                                    )}
                                />
                                <ErrorMessage error={formState.errors.name?.message} />
                            </div>

                            {/* Size Chart Table */}
                            <div className="space-y-4">
                                <Label>Size Chart</Label>
                                <div className="border rounded-sm overflow-x-auto !max-w-180 ">
                                    <div className="">
                                        <Table >
                                            <TableHeader>
                                                <TableRow className="bg-muted/50">
                                                    {headArray.fields.map((field, index) => (
                                                        <TableHead key={field.id} className="relative group min-w-[140px]">
                                                            <div className="flex items-center gap-2">
                                                                <Controller
                                                                    control={control}
                                                                    name={`head.${index}`}
                                                                    render={({ field }) => (
                                                                        <Input
                                                                            {...field}
                                                                            placeholder={`Column ${index + 1}`}
                                                                            className="border-0 bg-transparent !text-[13px] min-w-24 focus:bg-background focus:border focus:shadow-sm"
                                                                        />
                                                                    )}
                                                                />
                                                                {headArray.fields.length > 1 && (
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleRemoveColumn(index)}
                                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 h-8 w-8 text-destructive hover:text-destructive flex-shrink-0"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </TableHead>
                                                    ))}
                                                    <TableHead className="w-16 flex-shrink-0">
                                                        <Button
                                                            type="button"
                                                            onClick={handleAddColumn}
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>

                                            <TableBody>
                                                {rowArray.fields.map((rowField, rowIndex) => (
                                                    <TableRow key={rowField.id} className="group hover:bg-muted/25">
                                                        {headArray.fields.map((_, colIndex) => (
                                                            <TableCell key={colIndex} className="min-w-[140px]">
                                                                <Controller
                                                                    control={control}
                                                                    name={`row.${rowIndex}.${colIndex}`}
                                                                    render={({ field }) => (
                                                                        <Input
                                                                            {...field}
                                                                            placeholder={`Enter value`}
                                                                            className="border-0 bg-transparent !text-[13px] min-w-20 focus:bg-background focus:border focus:shadow-sm"
                                                                        />
                                                                    )}
                                                                />
                                                            </TableCell>
                                                        ))}
                                                        <TableCell className="w-16 flex-shrink-0">
                                                            {rowArray.fields.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => handleRemoveRow(rowIndex)}
                                                                    className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}

                                            </TableBody>
                                        </Table>
                                        <div className='my-6 w-full flex justify-center'>
                                            <Button
                                                type="button"
                                                onClick={handleAddRow}
                                                variant="outline"
                                                size="sm"
                                                className="gap-2"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Add Row
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </BgWrapper>

                    {/* Submit Button */}
                    <div className="flex justify-end">
                        <Button loading={addPending || editPending} type="submit" variant="default" className="gap-2">
                            {params?.chart_id ? 'Update' : 'Save'} Size Chart
                        </Button>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="flex-1/12 ">
                    <BgWrapper>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="status">Status</Label>
                                    <Controller
                                        control={control}
                                        name="status"
                                        render={({ field }) => (
                                            <Select value={field.value} onValueChange={field.onChange}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <ErrorMessage error={formState.errors.status?.message} />
                                </div>
                            </div>
                        </div>
                    </BgWrapper>


                </div>
            </form>
        </div>
    )
}