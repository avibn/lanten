import { Button } from "../ui/button";
import { ButtonHTMLAttributes } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export interface MainButtonProps {
    text?: string;
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
    icon?: JSX.Element;
    onClick?: () => void;
    linkPrefetch?: boolean;
    linkProps?: { [key: string]: any };
}

export function MainButton({
    text,
    isDisabled,
    isLoading,
    loadingText,
    className,
    type = "submit",
    variant = "default",
    icon,
    href,
    onClick,
    linkPrefetch = false,
    linkProps = {},
}: MainButtonProps) {
    const buttonContent = (
        <>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {icon &&
                !isLoading &&
                (text ? <span className="mr-2">{icon}</span> : <>{icon}</>)}
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
            onClick={onClick}
        >
            {href ? (
                <Link href={href} prefetch={linkPrefetch} {...linkProps}>
                    {buttonContent}
                </Link>
            ) : (
                <>{buttonContent}</>
            )}
        </Button>
    );
}
