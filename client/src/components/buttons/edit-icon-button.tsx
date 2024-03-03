import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import { cn } from "../../utils/tw-merge";

interface EditIconButtonProps {
    onClick?: () => void;
    className?: string;
    variant?: "default" | "outline" | "secondary" | "ghost";
}

export function EditIconButton({
    onClick,
    className,
    variant = "ghost",
}: EditIconButtonProps) {
    return (
        <Button
            size="icon"
            variant={variant}
            className={cn("size-8", className)}
            onClick={onClick}
        >
            <Edit size={16} />
        </Button>
    );
}
