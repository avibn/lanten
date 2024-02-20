import { Lease } from "@/models/lease";
import { fetchDataServer } from "../helpers/fetch-data-server";

export async function getLeases(): Promise<Lease[]> {
    const response = await fetchDataServer("/leases");
    return await response.json();
}

export async function getLease(id: string): Promise<Lease> {
    const response = await fetchDataServer(`/leases/${id}`);
    return await response.json();
}

export async function deleteLease(id: string) {
    await fetchDataServer(`/leases/${id}`, {
        method: "DELETE",
    });
}
