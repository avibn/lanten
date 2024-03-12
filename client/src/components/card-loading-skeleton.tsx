import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

interface CardLoadingSkeletonProps {
    loadingText?: string;
}

export default function CardLoadingSkeleton({
    loadingText = "Loading",
}: CardLoadingSkeletonProps) {
    return (
        <Card className="flex-1 relative">
            <Skeleton className="min-h-24 h-full w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-light">{loadingText}</span>
            </div>
        </Card>
    );
}
