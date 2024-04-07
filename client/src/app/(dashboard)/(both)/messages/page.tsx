import { Card, CardHeader } from "@/components/ui/card";
import { MessagesSquare, User } from "lucide-react";

import Link from "next/link";
import { MessageChannel } from "@/models/message";
import { formatTime } from "@/utils/format-time";
import { getMessageChannels } from "@/network/server/message";

export const metadata = {
    title: "Messages",
    description: "Messages",
};

export default async function Page() {
    let messageChannels: MessageChannel[] = [];
    try {
        messageChannels = await getMessageChannels();
    } catch (error) {
        console.error(error);
    }

    return (
        <div>
            <div className="flex items-center justify-between mt-2">
                <h3 className="text-xl font-semibold tracking-tight">
                    Recent Messages
                </h3>
            </div>
            <div className="mt-5 flex flex-col gap-4">
                {messageChannels.length === 0 && (
                    <p className="text-sm font-light">
                        No recent messages found. Start a conversation with a
                        tenant or landlord to get started.
                    </p>
                )}
                {messageChannels.map((channel) => (
                    <Link key={channel.id} href={`/messages/${channel.id}`}>
                        <Card
                            key={channel.id}
                            className="hover:bg-gray-100 duration-500"
                        >
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <User size={24} />
                                    <h3 className="text-base font-medium tracking-tight">
                                        {channel.name}
                                    </h3>
                                    <p className="text-sm font-light">
                                        {channel.email}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 !mt-0">
                                    <p className="text-sm font-light">
                                        {formatTime(channel.lastMessaged)}
                                    </p>
                                    <MessagesSquare
                                        size={24}
                                        strokeWidth={1.5}
                                    />
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
