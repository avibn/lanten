export const metadata = {
    title: "Messages",
    description: "Messages",
};

export default async function Page() {
    return (
        <div>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold tracking-tight">
                    Your Messages
                </h3>
            </div>
            <div className="mt-5 flex flex-col gap-4">{/* todo:: */}</div>
        </div>
    );
}
