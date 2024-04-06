import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form";

import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";

interface FormTextAreaFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label?: string;
    inputPlaceholder: string;
    description?: string | JSX.Element;
    readOnly?: boolean;
    disabled?: boolean;
}

export function FormTextAreaField({
    form,
    name,
    label,
    description,
    inputPlaceholder,
    readOnly = false,
    disabled = false,
}: FormTextAreaFieldProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Textarea
                            placeholder={inputPlaceholder}
                            {...field}
                            readOnly={readOnly}
                            disabled={disabled}
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
