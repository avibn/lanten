import { Lease } from "@/models/lease";
import { fetchDataServer } from "../helpers/fetch-data-server";

export async function getLeases(): Promise<Lease[]> {
    const response = await fetchDataServer("/leases", {
        next: {
            revalidate: 20,
            tags: ["leases"],
        },
    });
    return await response.json();
}

export async function getLease(id: string): Promise<Lease> {
    const response = await fetchDataServer(`/leases/${id}`, {
        next: {
            revalidate: 20,
            tags: ["leases"],
        },
    });
    return await response.json();
}
