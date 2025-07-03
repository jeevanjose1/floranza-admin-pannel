import { useState } from "react";
import { Controller } from "react-hook-form";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { PERMISSIONS } from "~/shared/others/others";

const permissions = Object.values(PERMISSIONS)

// Group permissions by module
const groupPermissions = (permissions: string[]) => {
    const grouped: Record<string, string[]> = {};

    permissions.forEach(permission => {
        const [module] = permission.split(':');
        if (!grouped[module]) {
            grouped[module] = [];
        }
        grouped[module].push(permission);
    });

    return grouped;
};

const GROUPED_PERMISSIONS = groupPermissions(permissions);

interface PermissionSelectorProps {
    control: any;
    name: string;
    label?: string;
    error?: string;
    defaultValue?: string[];
    setValue: any
}

export default function PermissionSelector({
    control,
    name,
    label = "Permissions",
    error,
    defaultValue = [],
    setValue
}: PermissionSelectorProps) {
    const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

    const toggleModule = (module: string) => {
        const newExpanded = new Set(expandedModules);
        if (newExpanded.has(module)) {
            newExpanded.delete(module);
        } else {
            newExpanded.add(module);
        }
        setExpandedModules(newExpanded);
    };

    const formatModuleName = (module: string) => {
        return module.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const formatPermissionAction = (permission: string) => {
        const [, action] = permission.split(':');
        return action.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const isModuleFullySelected = (module: string, selectedPermissions: string[]) => {
        const modulePermissions = GROUPED_PERMISSIONS[module];
        return modulePermissions.every(permission => selectedPermissions.includes(permission));
    };
    const isModulePartiallySelected = (module: string, selectedPermissions: string[]) => {
        const modulePermissions = GROUPED_PERMISSIONS[module];
        return modulePermissions.some(permission => selectedPermissions.includes(permission));
    };
    const toggleModulePermissions = (module: string, selectedPermissions: string[], onChange: (value: string[]) => void) => {
        const modulePermissions = GROUPED_PERMISSIONS[module];
        const isFullySelected = isModuleFullySelected(module, selectedPermissions);

        let newPermissions: string[];
        if (isFullySelected) {
            newPermissions = selectedPermissions.filter(p => !modulePermissions.includes(p));
        } else {
            newPermissions = [...new Set([...selectedPermissions, ...modulePermissions])];
        }

        onChange(newPermissions);
    };

    return (
        <div className="w-full mb-4">
            <div className="flex items-center justify-between mb-3">
                <Label htmlFor={name} className="text-sm font-medium">
                    {label}
                </Label>
                <div className="flex gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setValue(name, [])

                        }}
                        className="text-xs"
                    >
                        Clear All
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                            setValue(name, permissions)

                        }}
                        className="text-xs"
                    >
                        Select All
                    </Button>

                </div>
            </div>

            <Controller
                control={control}
                name={name}
                defaultValue={defaultValue}
                render={({ field }) => (
                    <ScrollArea className="border rounded-md p-3 max-h-80 overflow-y-scroll auto bg-muted/10 ">
                        <div className="hidden">
                            <Button
                                ref={(el) => {
                                    if (el && el.parentElement?.previousElementSibling) {
                                        const buttons = el.parentElement.previousElementSibling.querySelectorAll('button');
                                        if (buttons[0]) {
                                            buttons[0].onclick = () => field.onChange([]);
                                        }
                                        if (buttons[1]) {
                                            buttons[1].onclick = () => field.onChange(permissions);
                                        }
                                    }
                                }}
                            />
                        </div>

                        <div className=" ">
                            <div className="space-y-2 ">
                                {Object.keys(GROUPED_PERMISSIONS).map((module) => (
                                    <div key={module} className="border overflow-hidden rounded-md bg-white">
                                        <div
                                            className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/30"
                                            onClick={() => toggleModule(module)}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <Checkbox
                                                    checked={isModuleFullySelected(module, field.value || []) ? isModuleFullySelected(module, field.value || []) : isModulePartiallySelected(module, field.value || []) ? 'indeterminate' : false}
                                                    onCheckedChange={() => toggleModulePermissions(module, field.value || [], field.onChange)}
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                                <span className="font-medium text-sm">
                                                    {formatModuleName(module)}
                                                </span>
                                                <Badge variant="outline" className="text-xs">
                                                    {GROUPED_PERMISSIONS[module].length}
                                                </Badge>
                                            </div>
                                            {expandedModules.has(module) ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </div>

                                        {expandedModules.has(module) && (
                                            <div className="border-t muted/30 px-3 py-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                    {GROUPED_PERMISSIONS[module].map((permission) => (
                                                        <div key={permission} className="flex items-center space-x-2">
                                                            <Checkbox
                                                                checked={(field.value || []).includes(permission)}
                                                                onCheckedChange={(checked) => {
                                                                    const currentValue = field.value || [];
                                                                    const newValue = checked
                                                                        ? [...currentValue, permission]
                                                                        : currentValue.filter((p: string) => p !== permission);
                                                                    field.onChange(newValue);
                                                                }}
                                                            />
                                                            <span className="text-xs text-gray-600">
                                                                {formatPermissionAction(permission)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {field.value && field.value.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs ">Selected:</span>
                                    <Badge variant="secondary" className="text-xs">
                                        {field.value.length} permissions
                                    </Badge>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                )}
            />

            {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
        </div>
    );
}