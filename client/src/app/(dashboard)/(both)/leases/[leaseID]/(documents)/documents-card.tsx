import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import CardError from "@/components/card-error";
import { Document } from "@/models/document";
import DocumentContainer from "./document-container";
import { Lease } from "@/models/lease";
import { getDocuments } from "@/network/server/documents";

interface DocumentsCardProps {
    lease: Lease;
}

export default async function DocumentsCard({ lease }: DocumentsCardProps) {
    let landlordDocs: Document[] = [];
    let tenantDocs: Document[] = [];
    try {
        const response = await getDocuments(lease.id);
        landlordDocs = response.landlordDocs;
        tenantDocs = response.tenantDocs;
    } catch (error) {
        console.error(error);
        return <CardError message="Failed to load documents" />;
    }

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-lg font-medium">Documents</CardTitle>
                <div className="flex flex-wrap gap-2">
                    <h2 className="text-base font-medium">
                        Landlord Documents
                    </h2>
                    {landlordDocs.map((doc) => (
                        <DocumentContainer key={doc.id} document={doc} />
                    ))}
                </div>
                <div className="flex flex-wrap gap-2">
                    <h2 className="text-base font-medium">Tenant Documents</h2>
                    {tenantDocs.map((doc) => (
                        <DocumentContainer key={doc.id} document={doc} />
                    ))}
                </div>
            </CardHeader>
        </Card>
    );
}
