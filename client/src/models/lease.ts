import { User } from "./user";

export interface Lease {
    id: string;
    propertyId?: string;
    startDate: string;
    endDate: string;
    totalRent: number;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    property?: {
        name: string;
        address: string;
    };
    tenants?: Partial<User>[];
    payments?: any[]; // todo
    _count?: {
        tenants: number;
        payments: number;
    };
}
