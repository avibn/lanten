import { LeaseTenant } from "./lease-tenant";
import { Property } from "./property";

export interface Lease {
    id: string;
    propertyId?: string;
    description: string;
    inviteCode: string;
    startDate: string;
    endDate: string;
    totalRent: number;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    property?: Partial<Property>;
    tenants?: Partial<LeaseTenant>[];
    payments?: any[]; // todo
    _count?: {
        tenants: number;
        payments: number;
        announcements: number;
        documents: number;
        maintenanceRequests: number;
    };
}
