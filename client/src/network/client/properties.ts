import { Property } from "@/models/properties";
import { fetchData } from "../helpers/fetch-data";
import { useMutation } from "@tanstack/react-query";

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

export const useCreatePropertyMutation = () => {
    return useMutation({
        mutationFn: createProperty,
    });
};

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

export const useUpdatePropertyMutation = (id: string) => {
    return useMutation({
        mutationFn: (property: CreatePropertyBody) =>
            updateProperty(id, property),
    });
};
