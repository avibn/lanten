import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { UseFormReturn } from "react-hook-form";

type Option = {
    label: string;
    value: string;
};

interface FormRadioFieldProps {
    form: UseFormReturn<any>;
    name: string;
    label: string;
    options: Option[];
}

export function FormRadioField({
    form,
    name,
    label,
    options,
}: FormRadioFieldProps) {
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                        >
                            {options.map((option) => (
                                <FormItem
                                    className="flex items-center space-x-3 space-y-0"
                                    key={option.value}
                                >
                                    <FormControl>
                                        <RadioGroupItem value={option.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {option.label}
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
