import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface MainButtonProps {
    text: string;
    isDisabled?: boolean;
    isLoading?: boolean;
    loadingText?: string;
    className?: string;
    type?: string;
}

export function MainButton({
    text,
    isDisabled,
    isLoading,
    loadingText,
    className,
    type = "submit",
}: MainButtonProps) {
    return (
        <Button
            disabled={isDisabled || isLoading}
            className={className}
            type="submit"
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading && loadingText ? loadingText : text}
        </Button>
    );
}
