export interface Lease {
    id: string;
    propertyId?: string;
    startDate: string;
    endDate: string;
    totalRent: number;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
}
