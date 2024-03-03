import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form";

import { QuillEditor } from "@/components/quill-editor";
import { UseFormReturn } from "react-hook-form";

interface FormRichFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label?: string;
    inputPlaceholder: string;
    description?: string | JSX.Element;
    readOnly?: boolean;
}

export function FormRichField({
    form,
    name,
    label,
    description,
    inputPlaceholder,
    readOnly = false,
}: FormRichFieldProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <QuillEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={inputPlaceholder}
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
