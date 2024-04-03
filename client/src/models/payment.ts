import { Reminder } from "./reminder";

export type PaymentType = "RENT" | "DEPOSIT" | "UTILITIES" | "OTHER";
export type RecurringInterval =
    | "NONE"
    | "DAILY"
    | "WEEKLY"
    | "MONTHLY"
    | "YEARLY";

export interface Payment {
    id: string;
    amount: number;
    name: string;
    description: string;
    type: PaymentType;
    paymentDate: string;
    recurringInterval: RecurringInterval;
    leaseId: string;
    createdAt: string;
    updatedAt: string;
    reminders?: Reminder[];
}
