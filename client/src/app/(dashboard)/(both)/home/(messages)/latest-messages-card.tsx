import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import CardError from "@/components/card-error";
import Link from "next/link";
import { MainButton } from "@/components/buttons/main-button";
import { MessageChannel } from "@/models/message";
import { MessageCircle } from "lucide-react";
import { formatTime } from "@/utils/format-time";
import { getMessageChannels } from "@/network/server/message";

export async function LatestMessagesCard() {
    let messageChannels: MessageChannel[] = [];
    try {
        messageChannels = await getMessageChannels(3);
    } catch (error) {
        console.error(error);
        return <CardError message="Failed to load messages" />;
    }
    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg font-medium">
                        Latest Messages
                    </CardTitle>
                    <MainButton
                        text={`View All Messages`}
                        variant="link"
                        href={`/messages`}
                    />
                </div>
                {messageChannels.length === 0 && (
                    <p className="text-gray-500 text-sm">
                        No messages to display.
                    </p>
                )}
                {messageChannels.map((user) => (
                    <Link key={user.id} href={`/messages/${user.id}`} passHref>
                        <div className="flex flex-row gap-2 items-center justify-between w-full border rounded p-3 text-sm hover-card">
                            <div className="flex flex-row gap-2 items-center">
                                <MessageCircle size={16} />
                                <p className="truncate w-full max-w-[250px]">
                                    {user.name} ({user.email})
                                </p>
                            </div>
                            <p className="text-gray-600 text-sm">
                                {formatTime(user.lastMessaged)}
                            </p>
                        </div>
                    </Link>
                ))}
            </CardHeader>
        </Card>
    );
}
