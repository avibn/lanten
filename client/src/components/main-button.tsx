import { Button } from "./ui/button";
import { ButtonHTMLAttributes } from "react";
import Link from "next/link";
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
    href?: string;
}

export function MainButton({
    text,
    isDisabled,
    isLoading,
    loadingText,
    className,
    type = "submit",
    variant = "default",
    href,
}: MainButtonProps) {
    const buttonContent = (
        <>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading && loadingText ? loadingText : text}
        </>
    );
    return (
        <Button
            disabled={isDisabled || isLoading}
            className={className}
            type={type}
            variant={variant}
            asChild={href ? true : false}
        >
            {href ? (
                <Link href={href}>{buttonContent}</Link>
            ) : (
                <>{buttonContent}</>
            )}
        </Button>
    );
}
