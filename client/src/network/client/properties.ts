import { Property } from "@/models/properties";
import { fetchData } from "../helpers/fetch-data";

interface CreatePropertyBody {
    name: string;
    description: string;
    address: string;
}

export async function createProperty(
    property: CreatePropertyBody
): Promise<Property> {
    const response = await fetchData("/properties", {
        method: "POST",
        body: JSON.stringify(property),
        credentials: "include",
    });
    return await response.json();
}

export async function updateProperty(
    id: string,
    property: CreatePropertyBody
): Promise<Property> {
    const response = await fetchData(`/properties/${id}`, {
        method: "PUT",
        body: JSON.stringify(property),
        credentials: "include",
    });
    return await response.json();
}
