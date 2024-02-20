import { BackButton } from "@/components/back-button";
import { EditPropertyClient } from "./edit-property-client";
import { getProperty } from "@/network/server/properties";
import { getSessionUserOrRedirect } from "@/network/server/users";
import { redirect } from "next/navigation";

interface PageProps {
    params: {
        propertyID: string;
    };
}

export const metadata = {
    title: "Edit Property",
    description: "Edit the property details",
};

export default async function Page({ params: { propertyID } }: PageProps) {
    // Ensure the user is a landlord
    await getSessionUserOrRedirect("LANDLORD");

    // Get the property data
    let property = null;
    try {
        property = await getProperty(propertyID);
    } catch (error) {
        redirect("/properties");
    }

    return (
        <div className="flex flex-col items-start">
            <BackButton
                text="Property View"
                href={`/properties/${property.id}`}
            />
            <EditPropertyClient property={property} className="w-full" />
        </div>
    );
}
