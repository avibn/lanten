import { LeaseTenant } from "./lease-tenant";
import { Property } from "./property";
import { User } from "./user";

export interface Lease {
    id: string;
    propertyId?: string;
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
    };
}
