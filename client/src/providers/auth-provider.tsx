"use client";

import { User } from "@/models/user";
import { useAuthStore } from "@/stores/use-auth-store";

export const AuthProvider: React.FC<{
    user: User | null;
    children: React.ReactNode;
}> = ({ user, children }) => {
    const setUser = useAuthStore((state) => state.setUser);
    setUser(user);

    return <>{children}</>;
};
