import { Button } from "../ui/button";
import { Text } from "lucide-react";
import { cn } from "../../utils/tw-merge";

interface TextIconButtonProps {
    onClick?: () => void;
    className?: string;
    variant?: "default" | "outline" | "secondary" | "ghost";
}

export function TextIconButton({
    onClick,
    className,
    variant = "ghost",
}: TextIconButtonProps) {
    return (
        <Button
            size="icon"
            variant={variant}
            className={cn("size-8", className)}
            onClick={onClick}
        >
            <Text size={14} />
        </Button>
    );
}
