import { Button } from "../ui/button";
import { cn } from "../../utils/tw-merge";

interface IconButtonProps {
    onClick?: () => void;
    icon: React.ReactNode;
    className?: string;
    variant?: "default" | "outline" | "secondary" | "ghost";
    isDisabled?: boolean;
}

export function IconButton({
    onClick,
    icon,
    className,
    variant = "ghost",
    isDisabled = false,
}: IconButtonProps) {
    return (
        <Button
            size="icon"
            variant={variant}
            className={cn("size-8", className)}
            onClick={onClick}
            disabled={isDisabled}
        >
            {icon}
        </Button>
    );
}
