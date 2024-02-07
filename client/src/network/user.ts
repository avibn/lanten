import { User } from "@/models/user";
import { fetchData } from "./helpers/apiHelper";

interface LoginBody {
    email: string;
    password: string;
}

interface RegisterBody {
    name: string;
    email: string;
    password: string;
    userType: "tenant" | "landlord";
}

export const loginClient = async (body: LoginBody): Promise<User> => {
    const response = await fetchData("/users/login", {
        method: "POST",
        body: JSON.stringify(body),
    });
    return await response.json();
};

export const registerClient = async (body: RegisterBody): Promise<User> => {
    const response = await fetchData("/users/signup", {
        method: "POST",
        body: JSON.stringify(body),
    });
    return await response.json();
};

export const logoutClient = async () => {
    await fetchData("/users/logout", {
        method: "POST",
    });
};

export const getCurrentUserServer = async (): Promise<User> => {
    const response = await fetchData("/users/me", {}, true);
    return await response.json();
};
