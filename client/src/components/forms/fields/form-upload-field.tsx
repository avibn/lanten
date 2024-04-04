"use client";

import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form";

import { Input } from "../../ui/input";
import { UseFormReturn } from "react-hook-form";

interface FormUploadFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label?: string;
    inputPlaceholder: string;
    description?: string | JSX.Element;
    readOnly?: boolean;
    accept?: string[];
}

export function FormUploadField({
    form,
    name,
    label,
    description,
    inputPlaceholder,
    readOnly = false,
    accept,
}: FormUploadFieldProps) {
    // Create a string of accepted file types
    const acceptString = accept?.join(", ") || "";

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Input
                            placeholder={inputPlaceholder}
                            type="file"
                            readOnly={readOnly}
                            accept={acceptString}
                            onChange={(e) =>
                                field.onChange(
                                    e.target.files ? e.target.files[0] : null
                                )
                            }
                        />
                    </FormControl>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
