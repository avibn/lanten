import { User } from "@/models/user";
import { fetchData } from "./helpers/apiHelper";
import { useMutation } from "@tanstack/react-query";

interface LoginBody {
    email: string;
    password: string;
}

interface RegisterBody {
    name: string;
    email: string;
    password: string;
    type: "tenant" | "landlord";
}

// Login
const loginClient = async (body: LoginBody): Promise<User> => {
    const response = await fetchData("/users/login", {
        method: "POST",
        body: JSON.stringify(body),
        credentials: "include",
    });
    return await response.json();
};

export const useLoginMutation = () => {
    return useMutation({
        mutationFn: loginClient,
    });
};

// Register
const registerClient = async (body: RegisterBody): Promise<User> => {
    const response = await fetchData("/users/signup", {
        method: "POST",
        body: JSON.stringify(body),
    });
    return await response.json();
};

export const useRegisterMutation = () => {
    return useMutation({
        mutationFn: registerClient,
    });
};

// Logout
const logoutClient = async () => {
    await fetchData("/users/logout", {
        method: "POST",
        credentials: "include",
    });
};

export const useLogoutMutation = () => {
    return useMutation({
        mutationFn: logoutClient,
    });
};

// Get current user
export const getCurrentUserServer = async (): Promise<User> => {
    const response = await fetchData("/users/me", {}, true);
    return await response.json();
};

export const getCurrentUserClient = async (): Promise<User> => {
    const response = await fetchData("/users/me", {
        credentials: "include",
    });
    return await response.json();
};
