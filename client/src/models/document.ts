export interface Document {
    id: string;
    name: string;
    fileName: string;
    fileType: string;
    url?: string;
    type: "LANDLORD" | "TENANT";
    createdAt: string;
    updatedAt: string;
}

export interface DocumentsList {
    landlordDocs: Document[];
    tenantDocs: Document[];
}
