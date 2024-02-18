import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { MainButton } from "@/components/main-button";
import { formatTime } from "@/utils/format-time";
import { getProperties } from "@/network/server/properties";
import { getSessionUserOrRedirect } from "@/network/server/users";

export const revalidate = 0;

export const metadata = {
    title: "Properties",
    description: "Properties",
};

export default async function Page() {
    const user = await getSessionUserOrRedirect("LANDLORD");
    const properties = await getProperties();

    return (
        <div>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold tracking-tight">
                    Your Properties
                </h3>
                <MainButton text="Create Property" href="/properties/create" />
            </div>
            <div className="flex flex-wrap gap-3 mt-5">
                {properties.map((property) => (
                    <Card key={property.id}>
                        <CardHeader>
                            <CardTitle className="text-xl font-semibold tracking-tight">
                                {property.name}
                            </CardTitle>
                            <CardDescription>
                                {property.description}
                            </CardDescription>
                            <CardDescription>
                                {property.address}
                            </CardDescription>
                        </CardHeader>
                        <CardFooter>
                            <div className="flex flex-col gap-3">
                                <p className="text-sm font-light tracking text-gray-500">
                                    {property.createdAt ===
                                    property.updatedAt ? (
                                        <>
                                            Created:{" "}
                                            {formatTime(property.createdAt)}
                                        </>
                                    ) : (
                                        <>
                                            Last updated:{" "}
                                            {formatTime(property.updatedAt)}
                                        </>
                                    )}
                                </p>
                                <MainButton
                                    text="View Property"
                                    href={`/properties/${property.id}`}
                                    className="mt-3 w-full"
                                    variant="secondary"
                                />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
