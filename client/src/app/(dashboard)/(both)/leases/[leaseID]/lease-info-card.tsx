import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Error } from "@/models/error";
import { InfoEditDialog } from "./info-edit-dialog";
import { Lease } from "@/models/lease";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UpdateLeaseDescriptionFormValues } from "@/schemas/lease";
import { WithAuthorized } from "@/providers/with-authorized";
import { revalidateTag } from "next/cache";
import { sanitizeText } from "@/utils/sanitizeText";
import { updateLeaseDescription } from "@/network/server/leases";

interface LeaseInfoCardProps {
    lease: Lease;
}

export default function LeaseInfoCard({ lease }: LeaseInfoCardProps) {
    const editLeaseInfo = async (
        data: UpdateLeaseDescriptionFormValues
    ): Promise<Lease | Error> => {
        "use server";
        try {
            const response = await updateLeaseDescription(
                lease.id,
                data.description
            );
            revalidateTag("leases");
            return response;
        } catch (error) {
            return { error: "Something went wrong!" };
        }
    }; // todo:: lease.tenants shouldnt return password!!

    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg font-medium">
                        Lease Information
                    </CardTitle>
                    <WithAuthorized role="LANDLORD">
                        <InfoEditDialog
                            description={lease.description}
                            editLeaseInfo={editLeaseInfo}
                        />
                    </WithAuthorized>
                </div>
                {lease.description ? (
                    <ScrollArea>
                        <div
                            dangerouslySetInnerHTML={sanitizeText(
                                lease.description
                            )}
                            className="max-h-48 rich-text-area"
                        ></div>
                    </ScrollArea>
                ) : (
                    <p>A description has not been added yet.</p>
                )}
            </CardHeader>
        </Card>
    );
}
