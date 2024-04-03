import { Card } from "./ui/card";

interface CardErrorProps {
    message?: string;
}

export default function CardError({
    message = "An error occurred.",
}: CardErrorProps) {
    return (
        <Card className="flex-1">
            <div className="flex flex-col items-center justify-center h-full">
                <span className="text-lg font-light">{message}</span>
                <span className="text-sm font-light text-gray-500">
                    Please try again later.
                </span>
            </div>
        </Card>
    );
}
