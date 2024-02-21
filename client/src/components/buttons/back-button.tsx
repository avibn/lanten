import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

interface BackButtonProps {
    text: string;
    isDisabled?: boolean;
    className?: string;
    href?: string;
}

export function BackButton({
    text,
    isDisabled,
    className,
    href,
}: BackButtonProps) {
    const buttonContent = `Back to ${text}`;
    return (
        <Button
            disabled={isDisabled}
            className={className}
            variant="link"
            asChild={href ? true : false}
        >
            {href ? (
                <Link href={href}>
                    <ArrowLeft className="mr-2 font" strokeWidth={1.15} />
                    {buttonContent}
                </Link>
            ) : (
                <>{buttonContent}</>
            )}
        </Button>
    );
}
