import { Check, ChevronsUpDown } from "lucide-react";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import { CommandList } from "cmdk";
import LoadingSpinner from "@/components/loading-spinner";
import { UseFormReturn } from "react-hook-form";
import { cn } from "@/utils/tw-merge";
import { useState } from "react";

interface FormComboboxFieldProps {
    form?: UseFormReturn<any>;
    name: string;
    label: string;
    placeholder?: string;
    description?: string | JSX.Element;
    options: { value: string; label: string }[] | undefined;
    optionName?: string;
    isLoading?: boolean;
    onValueChange?: (value: string) => void;
    disabled?: boolean;
}

export function FormComboboxField({
    form,
    name,
    label,
    placeholder = "Select an option",
    description,
    options,
    optionName = "option",
    isLoading = false,
    onValueChange,
    disabled = false,
}: FormComboboxFieldProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | undefined>();

    if (!options) {
        options = [];
    }

    return (
        <FormField
            control={form?.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col gap-0.5 w-full">
                    <FormLabel>{label}</FormLabel>
                    <Popover open={dialogOpen} onOpenChange={setDialogOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    disabled={isLoading || disabled}
                                >
                                    {isLoading ? (
                                        <LoadingSpinner
                                            size={4}
                                            loadingText="Loading options..."
                                        />
                                    ) : (
                                        <>
                                            {field.value || selectedOption
                                                ? options.find(
                                                      (option) =>
                                                          option.value ===
                                                              field.value ||
                                                          option.value ===
                                                              selectedOption
                                                  )?.label
                                                : placeholder}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </>
                                    )}
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[300px] p-0">
                            <Command>
                                <CommandInput
                                    placeholder={`Search ${optionName}...`}
                                />
                                <CommandList>
                                    <CommandEmpty>
                                        No {optionName} found.
                                    </CommandEmpty>
                                    <CommandGroup>
                                        {options.map((option, index) => (
                                            <CommandItem
                                                value={option.label}
                                                key={index}
                                                onSelect={() => {
                                                    if (onValueChange) {
                                                        onValueChange(
                                                            option.value
                                                        );
                                                    } else {
                                                        form?.setValue(
                                                            name,
                                                            option.value
                                                        );
                                                    }
                                                    setSelectedOption(
                                                        option.value
                                                    );
                                                    setDialogOpen(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        option.value ===
                                                            field.value
                                                            ? "opacity-100"
                                                            : "opacity-0"
                                                    )}
                                                />
                                                {option.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                    {description && (
                        <FormDescription>{description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
