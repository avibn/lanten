import { User } from "./user";

export interface MessageResponse {
    recipient: User;
    messages: Message[];
}

export interface MessageChannel {
    id: string;
    email: string;
    name: string;
    lastMessaged: string;
}

export interface Message {
    id: string;
    message: string;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    authorId: string;
    author?: Partial<User>;
    recipientId: string;
    recipient?: Partial<User>;
}
