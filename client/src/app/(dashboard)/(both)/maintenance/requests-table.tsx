"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
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
    MaintenanceRequest,
    MaintenanceRequestType,
} from "@/models/maintenance";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";
import { Lease } from "@/models/lease";
import Link from "next/link";
import { MaintenanceDialog } from "@/components/segments/maintenance/maintenance-dialog";
import { RequestBadge } from "@/components/segments/maintenance/request-badge";
import { User } from "@/models/user";
import { formatTime } from "@/utils/format-time";
import { useState } from "react";

interface RequestsTableProps {
    requests: MaintenanceRequest[];
}

function sortColumn(column: Column<MaintenanceRequest, unknown>) {
    const dir = column.getIsSorted();
    if (dir === "asc") {
        column.toggleSorting(true);
    } else if (dir === "desc") {
        column.clearSorting();
    } else {
        column.toggleSorting(false);
    }
}

function getSortIcon(column: Column<MaintenanceRequest, unknown>) {
    if (column.getIsSorted() === "asc") {
        return <ArrowUp className="ml-2 h-4 w-4" />;
    }
    if (column.getIsSorted() === "desc") {
        return <ArrowDown className="ml-2 h-4 w-4" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
}

export const columns: ColumnDef<MaintenanceRequest>[] = [
    {
        accessorKey: "status",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => sortColumn(column)}>
                    Status
                    {getSortIcon(column)}
                </Button>
            );
        },
        cell: ({ row }) => <RequestBadge status={row.getValue("status")} />,
    },
    {
        accessorKey: "requestType",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => sortColumn(column)}>
                    Type
                    {getSortIcon(column)}
                </Button>
            );
        },
        cell: ({ row }) => {
            const type = row.getValue("requestType") as MaintenanceRequestType;
            return <div>{type.name}</div>;
        },
    },
    {
        accessorKey: "author",
        header: ({ column }) => {
            return (
                <Button variant="ghost" onClick={() => sortColumn(column)}>
                    Author
                    {getSortIcon(column)}
                </Button>
            );
        },
        cell: ({ row }) => {
            const author = row.getValue("author") as Partial<User>;
            return (
                <div className="lowercase">
                    {author?.name} ({author?.email})
                </div>
            );
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
                    Created
                    {getSortIcon(column)}
                </Button>
            );
        },
        cell: ({ row }) => {
            const createdAt = formatTime(row.getValue("createdAt"));
            return <div>{createdAt}</div>;
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
                    <Link href={`/leases/${lease?.id}`}>
                        {lease?.property?.name}
                    </Link>
                </Button>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
            const maintenanceRequest: MaintenanceRequest = row.original;

            return (
                <MaintenanceDialog maintenanceRequest={maintenanceRequest}>
                    <Button variant="secondary">View</Button>
                </MaintenanceDialog>
            );
        },
    },
];

export function RequestsTable({ requests }: RequestsTableProps) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data: requests,
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
                {/* <div className="flex-1"></div> */}
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
