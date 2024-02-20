"use client";

import { LeaseCreateFormValues, leaseCreateSchema } from "@/schemas/lease";

import { Form } from "@/components/ui/form";
import { FormDateField } from "./fields/form-date-field";
import { FormSelectField } from "./fields/form-select-field";
import { FormTextField } from "@/components/forms/fields/form-text-field";
import Link from "next/link";
import { MainButton } from "@/components/main-button";
import { Property } from "@/models/property";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface CreateLeaseFormProps {
    properties: Property[];
    onSubmit(values: any): void;
    loading?: boolean;
    defaultValues?: LeaseCreateFormValues;
}

export function CreateLeaseForm({
    properties,
    onSubmit,
    loading,
    defaultValues,
}: CreateLeaseFormProps) {
    const form = useForm<LeaseCreateFormValues>({
        resolver: zodResolver(leaseCreateSchema),
        defaultValues: {
            startDate: new Date().toDateString(), // today
            endDate: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
            ).toDateString(), //next year
            totalRent: 1000,
            ...defaultValues,
        },
    });

    const propertiesOptions = properties.map((property) => ({
        value: property.id,
        label: property.name,
    }));

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormSelectField
                    form={form}
                    name="propertyId"
                    label="Property"
                    placeholder="Select a property"
                    description={
                        <>
                            Choose the property for the lease or{" "}
                            <Link
                                href="/properties/create"
                                className="link-primary"
                            >
                                create a new property
                            </Link>
                            .
                        </>
                    }
                    options={propertiesOptions}
                />
                <FormDateField
                    form={form}
                    name="startDate"
                    label="Start Date"
                />
                <FormDateField form={form} name="endDate" label="End Date" />
                <FormTextField
                    form={form}
                    name="totalRent"
                    label="Total Rent"
                    inputPlaceholder="1000"
                    inputType="number"
                    description="The total rent for the lease, for all tenants combined (in GBP)."
                />
                <MainButton
                    text={defaultValues ? "Update Lease" : "Create Lease"}
                    loadingText={
                        defaultValues
                            ? "Updating Lease..."
                            : "Creating Lease..."
                    }
                    isLoading={loading}
                    className="w-full"
                />
            </form>
        </Form>
    );
}
