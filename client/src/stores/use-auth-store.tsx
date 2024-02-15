import { User } from "@/models/user";
import { create } from "zustand";

type AuthStore = {
    user: User | null;
    setUser: (user: User | null) => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
    user: null,
    setUser: (user) => set({ user }),
}));
