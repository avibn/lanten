import { Lease } from "./lease";

export interface Property {
    id: string;
    name: string;
    description: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    landlordId: string;
    leases?: Lease[];
    _count?: {
        leases: number;
    };
}
