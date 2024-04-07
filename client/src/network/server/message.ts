import { MessageChannel } from "@/models/message";
import { fetchDataServer } from "../helpers/fetch-data-server";

export async function getMessageChannels(
    max?: number
): Promise<MessageChannel[]> {
    const response = await fetchDataServer(
        `/messages/channels${max ? `?max=${max}` : ""}`,
        {
            next: {
                revalidate: 0,
                tags: ["MessageChannels"],
            },
        }
    );
    return await response.json();
}
