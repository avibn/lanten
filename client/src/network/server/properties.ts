import { Property } from "@/models/properties";
import { fetchDataServer } from "../helpers/fetch-data-server";

export async function getProperties(): Promise<Property[]> {
    const response = await fetchDataServer("/properties");
    return await response.json();
}

export async function getProperty(id: string): Promise<Property> {
    const response = await fetchDataServer(`/properties/${id}`);
    return await response.json();
}

export async function deleteProperty(id: string) {
    await fetchDataServer(`/properties/${id}`, {
        method: "DELETE",
    });
}
