import { User } from "@/models/user";
import { create } from "zustand";
import { getCurrentUserClient } from "@/network/user";

type AuthStore = {
    user: User | null;
    setUser: (user: User | null) => void;
    fetchUser: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    setUser: (user) => set({ user }),
    fetchUser: () => {
        getCurrentUserClient()
            .then((user) => {
                set({ user });
            })
            .catch(() => {
                set({ user: null });
            });
    },
}));
