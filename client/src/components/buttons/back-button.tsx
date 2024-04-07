import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface BackButtonProps {
    text: string;
    isDisabled?: boolean;
    className?: string;
    href?: string;
    customText?: boolean;
}

export function BackButton({
    text,
    isDisabled,
    className,
    href,
    customText = false,
}: BackButtonProps) {
    const buttonContent = customText ? text : `Back to ${text}`;
    return (
        <Button
            disabled={isDisabled}
            className={className}
            variant="link"
            asChild={href ? true : false}
        >
            {href ? (
                <Link href={href} prefetch={false}>
                    <ArrowLeft className="mr-2 font" strokeWidth={1.15} />
                    {buttonContent}
                </Link>
            ) : (
                <>{buttonContent}</>
            )}
        </Button>
    );
}
