import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { AddButton } from "@/components/buttons/add-button";
import { ForbiddenError } from "@/network/errors/httpErrors";
import Image from "next/image";
import Link from "next/link";
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
        <div className="page-content">
            <div className="flex items-center justify-between title-text">
                <h3 className="text-xl font-semibold tracking-tight">
                    Your Properties
                </h3>
                <AddButton text="Create Property" href="/properties/create" />
            </div>
            <div className="flex flex-wrap gap-5 mt-5 max-md:justify-center">
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
                    <Link
                        key={property.id}
                        href={`/properties/${property.id}`}
                        className="flex-grow flex-shrink basis-0 max-w-80"
                    >
                        <Card className="hover-card h-full">
                            <div className="relative aspect-video overflow-hidden rounded-t-lg h-[150px] w-full">
                                <Image
                                    src={
                                        property.propertyImage?.url ||
                                        "/house-placeholder.jpg"
                                    }
                                    alt="Property Image"
                                    fill
                                    style={{ objectFit: "cover" }}
                                />
                                {/* Gradient overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-transparent opacity-70" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-2 px-4 text-center">
                                    <div className="text-white font-semibold tracking-wider trancuted-text">
                                        {property.name}
                                    </div>
                                    <div className="text-sm text-gray-300 trancuted-text">
                                        {property.address}
                                    </div>
                                </div>
                            </div>
                            <CardHeader className="py-4">
                                <CardTitle className="text-lg font-semibold tracking-tight trancuted-text">
                                    {property.name}
                                </CardTitle>
                                <CardDescription className="trancuted-text">
                                    {property.description}
                                </CardDescription>
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
                                </div>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
