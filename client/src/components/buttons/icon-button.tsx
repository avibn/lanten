import { Button } from "../ui/button";
import LoadingSpinner from "../loading-spinner";
import { cn } from "../../utils/tw-merge";

interface IconButtonProps {
    onClick?: () => void;
    icon: React.ReactNode;
    className?: string;
    variant?: "default" | "outline" | "secondary" | "ghost";
    isDisabled?: boolean;
    isLoading?: boolean;
}

export function IconButton({
    onClick,
    icon,
    className,
    variant = "ghost",
    isDisabled = false,
    isLoading = false,
}: IconButtonProps) {
    return (
        <Button
            size="icon"
            variant={variant}
            className={cn("size-8", className)}
            onClick={onClick}
            disabled={isDisabled || isLoading}
        >
            {isLoading ? <LoadingSpinner size={6} textOff /> : icon}
        </Button>
    );
}
