import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { AddButton } from "@/components/buttons/add-button";
import { ForbiddenError } from "@/network/errors/httpErrors";
import Link from "next/link";
import { MainButton } from "@/components/buttons/main-button";
import { Property } from "@/models/property";
import { formatTime } from "@/utils/format-time";
import { getProperties } from "@/network/server/properties";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Properties",
    description: "Properties",
};

export default async function Page() {
    // Get the list of properties
    let properties: Property[] = [];
    try {
        properties = await getProperties();
    } catch (error) {
        if (error instanceof ForbiddenError) {
            redirect("/home");
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between title-text">
                <h3 className="text-xl font-semibold tracking-tight">
                    Your Properties
                </h3>
                <AddButton text="Create Property" href="/properties/create" />
            </div>
            <div className="flex flex-wrap gap-3 mt-5">
                {properties.length === 0 && (
                    <p className="text-lg font-light tracking-tight">
                        You have no properties yet.{" "}
                        <Link
                            href="/properties/create"
                            className="hover:underline hover:text-green-700"
                        >
                            Create
                        </Link>{" "}
                        one to get started.
                    </p>
                )}

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
                                    linkPrefetch={false}
                                />
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
