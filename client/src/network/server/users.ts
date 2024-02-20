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

    const response = await fetchDataServer("/users/me", {
        next: {
            revalidate: 30,
        },
    });
    return await response.json();
};

/**
 * Retrieves the session user or redirects to a specified path if unauthenticated or unauthorized.
 *
 * @param userType - The expected user type.
 * @param typeRedirectPath - The path to redirect if the user does not match the expected type.
 * @returns A Promise that resolves to the session user.
 */
export async function getSessionUserOrRedirect(
    userType?: string,
    typeRedirectPath: string = "/home"
): Promise<User> {
    // todo:: redirect to /home?error=UnauthorizedPageAccess instead?

    let user: User | null = null;
    let redirectPath: string | null = null;
    try {
        user = await getSessionUser();

        // Redirect if user type is invalid
        if (userType && user.userType !== userType) {
            redirectPath = typeRedirectPath;
        }
    } catch (error) {
        console.error("Failed to get current user (redirect)");
        return redirect("/login");
    } finally {
        if (redirectPath) {
            console.log("Redirerecting to: ", redirectPath);
            redirect(redirectPath);
        }
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
