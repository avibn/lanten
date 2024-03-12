"use client";

import { useAuthStore } from "@/stores/use-auth-store";

export const WithAuthorized: React.FC<{
    role: "LANDLORD" | "TENANT";
    children: React.ReactNode;
}> = ({ role, children }) => {
    const currentUser = useAuthStore((state) => state.user);

    if (!currentUser) {
        return null;
    } else if (currentUser.userType !== role) {
        return null;
    }
    return <>{children}</>;
};
