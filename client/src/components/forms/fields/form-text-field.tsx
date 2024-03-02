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

interface FormTextFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label?: string;
    inputPlaceholder: string;
    inputType?: string;
    description?: string | JSX.Element;
    readOnly?: boolean;
}

export function FormTextField({
    form,
    name,
    label,
    description,
    inputPlaceholder,
    inputType = "text",
    readOnly = false,
}: FormTextFieldProps) {
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
                            type={inputType}
                            {...field}
                            readOnly={readOnly}
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
