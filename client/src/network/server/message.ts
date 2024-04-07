import { MessageChannel } from "@/models/message";
import { fetchDataServer } from "../helpers/fetch-data-server";

export async function getMessageChannels(): Promise<MessageChannel[]> {
    const response = await fetchDataServer("/messages/channels", {
        next: {
            revalidate: 0,
            tags: ["MessageChannels"],
        },
    });
    return await response.json();
}
