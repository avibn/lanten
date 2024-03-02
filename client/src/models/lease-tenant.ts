import { Property } from "./property";
import { User } from "./user";

export interface LeaseTenant {
    id: string;
    leaseId: string;
    tenantId: string;
    createdAt: string;
    updatedAt: string;
    isDeleted: boolean;
    tenant?: Partial<User>;
    lease?: Partial<Property>;
}
