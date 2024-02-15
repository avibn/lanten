import { UnauthorizedError } from "../errors/httpErrors";
import { User } from "@/models/user";
import { cookies } from "next/headers";
import { fetchDataServer } from "../helpers/fetch-data-server";
import { redirect } from "next/navigation";

/**
 * Retrieves the session user.
 * @returns A promise that resolves to the session user.
 */
export const getSessionUser = async (): Promise<User> => {
    const cookie = cookies().get("connect.sid");
    if (!cookie) {
        throw new UnauthorizedError("Not logged in");
    }

    const response = await fetchDataServer("/users/me");
    return await response.json();
};

/**
 * Retrieves the session user or redirects to the login page if the user is not authenticated.
 * @returns A promise that resolves to the session user.
 */
export async function getSessionUserOrRedirect(): Promise<User> {
    let user: User | null = null;
    try {
        user = await getSessionUser();
    } catch (error) {
        console.error("Failed to get current user (redirect)");
        redirect("/login");
    }
    return user;
}

/**
 * Retrieves the session user and redirects to the home page if the user is authenticated.
 * @returns A promise that resolves to the session user or null if the user is invalid.
 */
export async function getSessionUserAndRedirectHome(): Promise<User | null> {
    let redirectPath: string | null = null;
    let user: User | null = null;

    // Check invalid user
    try {
        // Try to get the current user
        user = await getSessionUser();

        // If the user is valid, redirect to home
        redirectPath = "/home";
    } catch (error) {
        console.error("Failed to get current user (page)");
    } finally {
        // Redirect user
        if (redirectPath) {
            redirect(redirectPath);
        }
    }

    return user;
}
