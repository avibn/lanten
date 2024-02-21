import { Property } from "@/models/property";
import { fetchData } from "../helpers/fetch-data";
import { useMutation } from "@tanstack/react-query";

interface CreatePropertyBody {
    name: string;
    description: string;
    address: string;
}

async function createProperty(property: CreatePropertyBody): Promise<Property> {
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

async function updateProperty(
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

async function deleteProperty(id: string): Promise<void> {
    await fetchData(`/properties/${id}`, {
        method: "DELETE",
        credentials: "include",
    });
}

export const useDeletePropertyMutation = () => {
    return useMutation({
        mutationFn: deleteProperty,
    });
};
