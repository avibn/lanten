import { Lease } from "./lease";
import { User } from "./user";

export interface Property {
    id: string;
    name: string;
    description: string;
    address: string;
    createdAt: string;
    updatedAt: string;
    landlordId: string;
    landlord?: Partial<User>;
    leases?: Lease[];
    _count?: {
        leases: number;
    };
    propertyImage?: PropertyImage;
}

export interface PropertyImage {
    id: string;
    url: string;
    fileName?: string;
    fileType?: string;
}
