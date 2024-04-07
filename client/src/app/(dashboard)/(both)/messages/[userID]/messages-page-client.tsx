"use client";

import { Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
    useGetMessagesQuery,
    useSendMessageMutation,
} from "@/network/client/message";

import { IconButton } from "@/components/buttons/icon-button";
import { Message } from "@/models/message";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { formatTime } from "@/utils/format-time";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";

interface MessagesPageClientProps {
    recipientId: string;
}

export default function MessagesPageClient({
    recipientId,
}: MessagesPageClientProps) {
    const user = useAuthStore((state) => state.user);
    const messagesQuery = useGetMessagesQuery(recipientId);
    const sendMessageMutation = useSendMessageMutation();
    const [newMessage, setNewMessage] = useState("");
    const scrollDiv = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);

    // Scroll to bottom when new message is added
    useEffect(() => {
        if (scrollDiv.current) {
            scrollDiv.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (messagesQuery.data?.messages) {
            setMessages(messagesQuery.data.messages);
        }
    }, [messagesQuery.data?.messages]);

    // Get message handlers
    if (messagesQuery.isLoading) {
        return <p>Loading...</p>;
    } else if (messagesQuery.isError) {
        return <p>Error</p>;
    } else if (!messagesQuery.data) {
        return <p>Messages could not be fetched! Please try again.</p>;
    }
    const { recipient } = messagesQuery.data;

    // Send message handlers
    if (sendMessageMutation.isSuccess) {
        setMessages([...messages, sendMessageMutation.data]);
        setNewMessage("");

        // Reset mutation
        sendMessageMutation.reset();
    } else if (sendMessageMutation.isError) {
        toast.error("Failed to send message. Please try again.");
        sendMessageMutation.reset();
    }
    const handleSendMessage = () => {
        if (!newMessage) {
            return;
        }
        sendMessageMutation.mutate({ recipientId, message: newMessage });
    };

    return (
        <div className="flex flex-col w-full h-[95%]">
            <div className="flex items-center justify-between w-full h-[5%]">
                <p className="text-sm text-gray-500 mx-10 flex items-center">
                    <User size={16} className="mr-2" />
                    <p>
                        Chatting with: {recipient.name} ({recipient.email})
                    </p>
                </p>
            </div>
            <div className="flex mx-10 h-[80%]">
                <ScrollArea className="w-full overflow-y-auto flex flex-col h-full justify-end px-4">
                    {messages.length === 0 && (
                        <p className="text-center text-gray-500">
                            Send a message to start chatting! 🚀
                        </p>
                    )}
                    {messages.map((message) => {
                        const isAuthor = message.authorId === user?.id;

                        return (
                            <div
                                key={message.id}
                                className={`flex flex-col gap-1 w-full mb-3 ${
                                    isAuthor ? "items-end" : "items-start"
                                }`}
                            >
                                <div
                                    className={`flex flex-col gap-1 px-5 text-message max-w-fit
                            ${isAuthor ? "right-text" : "left-text"}`}
                                >
                                    <p>{message.message}</p>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <p className="text-xs text-gray-500">
                                        {formatTime(message.createdAt)},
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {isAuthor ? "You" : recipient.name}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={scrollDiv}></div>
                </ScrollArea>
            </div>
            <div className="flex items-center gap-3 mx-10 h-[15%]">
                <div className="relative flex flex-col w-full">
                    <Textarea
                        placeholder="Type a message..."
                        className="flex-1 min-h-12 resize-none pb-4"
                        onChange={(e) => {
                            if (e.target.value.length > 250) {
                                return;
                            }
                            setNewMessage(e.target.value);
                        }}
                        value={newMessage}
                        disabled={sendMessageMutation.isPending}
                    />
                    <p
                        className={`absolute bottom-0 right-0 pr-4 text-gray-500 text-xs ${
                            newMessage.length >= 250 ? "text-red-500" : ""
                        }`}
                    >
                        {newMessage.length} / 250
                    </p>
                </div>
                <IconButton
                    icon={<Send size={19} />}
                    className="h-12 w-12"
                    onClick={handleSendMessage}
                    isDisabled={!newMessage}
                    isLoading={sendMessageMutation.isPending}
                />
            </div>
        </div>
    );
}
