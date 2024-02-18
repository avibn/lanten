import { MainButton } from "@/components/main-button";
import { getProperties } from "@/network/server/properties";
import { getSessionUserOrRedirect } from "@/network/server/users";

export const revalidate = 0;

export const metadata = {
    title: "Properties",
    description: "Properties",
};

export default async function Page() {
    const user = await getSessionUserOrRedirect();
    const properties = await getProperties();

    return (
        <div>
            <h3 className="text-xl font-semibold tracking-tight">
                Properties of {user?.name}
            </h3>
            <MainButton text="Create Property" href="/properties/create" />
            <ul>
                {properties.map((property) => (
                    <li key={property.id}>
                        <span>{property.name}</span>
                        <span>{property.description}</span>
                        <span>{property.address}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
