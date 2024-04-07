import { BackButton } from "@/components/buttons/back-button";
import MessagesPageClient from "./messages-page-client";

interface PageProps {
    params: {
        userID: string;
    };
}

export default async function Page({ params: { userID } }: PageProps) {
    return (
        <div className="flex flex-col items-start h-full">
            <BackButton text="Messages" href="/messages" className="h-[5%]" />
            <MessagesPageClient recipientId={userID} />
        </div>
    );
}
