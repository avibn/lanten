import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Document, DocumentsList } from "@/models/document";

import CardError from "@/components/card-error";
import DocumentContainer from "./document-container";
import { DocumentUploadDialog } from "./document-upload-dialog";
import { Lease } from "@/models/lease";
import { getDocuments } from "@/network/server/documents";

interface DocumentsCardProps {
    lease: Lease;
}

export default async function DocumentsCard({ lease }: DocumentsCardProps) {
    let landlordDocs: Document[] = [];
    let tenantDocs: Document[] = [];
    let allDocs: DocumentsList;
    try {
        const response = await getDocuments(lease.id);
        landlordDocs = response.landlordDocs;
        tenantDocs = response.tenantDocs;
        allDocs = response;
    } catch (error) {
        console.error(error);
        return <CardError message="Failed to load documents" />;
    }

    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg font-medium">
                        Documents
                    </CardTitle>
                    <DocumentUploadDialog
                        leaseID={lease.id}
                        documents={allDocs}
                    />
                </div>
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
