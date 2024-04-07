import { Button } from "../ui/button";
import Link from "next/link";
import LoadingSpinner from "../loading-spinner";
import { cn } from "../../utils/tw-merge";

interface IconButtonProps {
    onClick?: () => void;
    icon: React.ReactNode;
    className?: string;
    variant?: "default" | "outline" | "secondary" | "ghost";
    isDisabled?: boolean;
    isLoading?: boolean;
    href?: string;
    hrefNewTab?: boolean;
}

export function IconButton({
    onClick,
    icon,
    className,
    variant = "ghost",
    isDisabled = false,
    isLoading = false,
    href,
    hrefNewTab,
}: IconButtonProps) {
    return (
        <Button
            size="icon"
            variant={variant}
            className={cn("size-8", className)}
            onClick={onClick}
            disabled={isDisabled || isLoading}
            asChild={!!href}
        >
            {isLoading ? (
                <LoadingSpinner size={6} textOff />
            ) : href ? (
                (hrefNewTab && (
                    <a href={href} target="_blank" rel="noreferrer noopener">
                        {icon}
                    </a>
                )) || <Link href={href}>{icon}</Link>
            ) : (
                icon
            )}
        </Button>
    );
}
