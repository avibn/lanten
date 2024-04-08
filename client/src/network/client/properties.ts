import { Property } from "@/models/property";
import { fetchData } from "../helpers/fetch-data";
import { useMutation } from "@tanstack/react-query";

interface CreatePropertyBody {
    name: string;
    description: string;
    address: string;
    file?: File;
}

async function createProperty(property: CreatePropertyBody): Promise<Property> {
    const formData = new FormData();
    formData.append("name", property.name);
    formData.append("description", property.description);
    formData.append("address", property.address);
    if (property.file) {
        formData.append("files[]", property.file);
    }

    const response = await fetchData(
        "/properties",
        {
            method: "POST",
            body: formData,
            credentials: "include",
        },
        false
    );
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
    const formData = new FormData();
    formData.append("name", property.name);
    formData.append("description", property.description);
    formData.append("address", property.address);
    if (property.file) {
        formData.append("files[]", property.file);
        formData.append("updateImage", "true");
    }

    const response = await fetchData(
        `/properties/${id}`,
        {
            method: "PUT",
            body: formData,
            credentials: "include",
        },
        false
    );
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
