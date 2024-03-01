import { Property } from "@/models/property";
import { fetchDataServer } from "../helpers/fetch-data-server";

export async function getProperties(): Promise<Property[]> {
    const response = await fetchDataServer("/properties", {
        next: {
            revalidate: 20,
        },
    });
    return await response.json();
}

export async function getProperty(id: string): Promise<Property> {
    const response = await fetchDataServer(`/properties/${id}`, {
        next: {
            revalidate: 20,
        },
    });
    return await response.json();
}
