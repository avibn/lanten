"use client";

import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Mail,
    MessageCircle,
    Search,
} from "lucide-react";
import {
    Column,
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/buttons/icon-button";
import { Input } from "@/components/ui/input";
import { Lease } from "@/models/lease";
import { LeaseTenant } from "@/models/lease-tenant";
import Link from "next/link";
import { formatTime } from "@/utils/format-time";
import { useState } from "react";

interface TenantsTableProps {
    leaseTenants: LeaseTenant[];
}

function sortColumn(column: Column<LeaseTenant, unknown>) {
    const dir = column.getIsSorted();
    if (dir === "asc") {
        column.toggleSorting(true);
    } else if (dir === "desc") {
        column.clearSorting();
    } else {
        column.toggleSorting(false);
    }
}

function getSortIcon(column: Column<LeaseTenant, unknown>) {
    if (column.getIsSorted() === "asc") {
        return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    if (column.getIsSorted() === "desc") {
        return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
}

export const columns: ColumnDef<LeaseTenant>[] = [
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => sortColumn(column)}>
                    Email
                    {getSortIcon(column)}
                </Button>
            );
        },
        // cell: ({ row }) => {
        //     const tenant = row.getValue("tenant") as Partial<User>;
        //     return <div>{tenant?.email}</div>;
        // },
        accessorFn: (row: LeaseTenant) => {
            return row.tenant?.email;
        },
    },
    {
        accessorKey: "name",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => sortColumn(column)}>
                    Name
                    {getSortIcon(column)}
                </Button>
            );
        },
        // cell: ({ row }) => {
        //     const tenant: User = row.getValue("tenant");
        //     return <div className="capitalize">{tenant?.name}</div>;
        // },
        accessorFn: (row: LeaseTenant) => {
            return row.tenant?.name;
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => sortColumn(column)}
                    className="text-right"
                >
                    Joined
                    {getSortIcon(column)}
                </Button>
            );
        },
        cell: ({ row }) => {
            const createdAt: string = row.getValue("createdAt");
            return <div>{formatTime(createdAt)}</div>;
        },
    },
    {
        accessorKey: "lease",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => sortColumn(column)}
                    className="text-right"
                >
                    Lease
                    {getSortIcon(column)}
                </Button>
            );
        },
        cell: ({ row }) => {
            const lease = row.getValue("lease") as Partial<Lease>;
            return (
                <Button variant="link" asChild className="p-0">
                    <Link href={`/leases/${lease?.id}`} prefetch={false}>
                        {lease?.property?.name}
                    </Link>
                </Button>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const leaseTenant: LeaseTenant = row.original;
            return (
                <div className="flex items-center">
                    <IconButton
                        icon={<MessageCircle size={18} />}
                        href={`/messages/${leaseTenant.tenant?.id}`}
                    />
                    <IconButton
                        icon={<Mail size={18} />}
                        href={`mailto:${leaseTenant.tenant?.email}`}
                        hrefNewTab
                    />
                </div>
            );
        },
    },
];

export function TenantsTable({ leaseTenants }: TenantsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: leaseTenants,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    });

    return (
        <div className="w-full">
            <div className="flex items-center gap-2 mb-4">
                <Search size={19} className="text-gray-500" />
                <Input
                    placeholder="Search by email"
                    onChange={(event) =>
                        table
                            .getColumn("email")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2 float-right">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
}
