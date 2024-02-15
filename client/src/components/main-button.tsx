import { Button } from "./ui/button";
import { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

interface MainButtonProps {
    text: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    className?: string;
    type?: ButtonHTMLAttributes<HTMLButtonElement>["type"];
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link"
        | null
        | undefined;
}

export function MainButton({
    text,
    isDisabled,
    isLoading,
    loadingText,
    className,
    type = "submit",
    variant = "default",
}: MainButtonProps) {
    return (
        <Button
            disabled={isDisabled || isLoading}
            className={className}
            type={type}
            variant={variant}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading && loadingText ? loadingText : text}
        </Button>
    );
}
