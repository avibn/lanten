import { Lease } from "./lease";

export interface Announcement {
    id: string;
    title: string;
    message: string;
    leaseId: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    lease?: Partial<Lease>;
}
