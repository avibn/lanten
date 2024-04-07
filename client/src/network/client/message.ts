import { Message, MessageResponse } from "@/models/message";
import { useMutation, useQuery } from "@tanstack/react-query";

import { fetchData } from "../helpers/fetch-data";

interface MessageData {
    recipientId: string;
    message: string;
}

async function sendMessage({
    recipientId,
    message,
}: MessageData): Promise<Message> {
    const response = await fetchData(`/users/${recipientId}/messages`, {
        method: "POST",
        body: JSON.stringify({
            text: message,
        }),
        credentials: "include",
    });
    return await response.json();
}

export const useSendMessageMutation = () => {
    return useMutation({
        mutationFn: (data: MessageData) => sendMessage(data),
    });
};

async function deleteMessage(messageId: string): Promise<void> {
    await fetchData(`/messages/${messageId}`, {
        method: "DELETE",
        credentials: "include",
    });
}

export const useDeleteMessageMutation = () => {
    return useMutation({
        mutationFn: (messageId: string) => deleteMessage(messageId),
    });
};

interface MessageQueryParams {
    max?: number;
    from?: string;
}

async function getMessages(
    recipientId: string,
    query?: MessageQueryParams
): Promise<MessageResponse> {
    const response = await fetchData(
        `/users/${recipientId}/messages?${new URLSearchParams({
            ...(query?.max && { max: query.max.toString() }),
            ...(query?.from && { from: query.from }),
        }).toString()}`,
        {
            credentials: "include",
        }
    );
    return await response.json();
}

export const useGetMessagesQuery = (
    recipientId: string,
    query?: MessageQueryParams
) => {
    return useQuery({
        queryKey: ["messages", recipientId],
        queryFn: () => getMessages(recipientId, query),
        refetchInterval: 30000,
    });
};
