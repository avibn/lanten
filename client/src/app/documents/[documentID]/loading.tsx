import LoadingSpinner from "@/components/loading-spinner";

export default function Loading() {
    return (
        <div className="flex justify-center items-center h-screen">
            <LoadingSpinner loadingText="Loading document..." />
        </div>
    );
}
