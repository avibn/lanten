import { cookies } from "next/headers";
import { statusCodeErrorMap } from "../errors/httpErrors";

/**
 * Fetches data from the server.
 * @param input - The URL to fetch.
 * @param init - The optional RequestInit object for additional configuration.
 * @param isServerRequest - Whether the request is made from the server.
 * @returns A Promise that resolves to the Response object representing the fetched data.
 * @throws Error if the base URL is not set, if fetching data fails, or if an HTTP error occurs.
 */
export async function fetchData(
    input: RequestInfo,
    init: RequestInit = {},
    isServerRequest = false
) {
    const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

    if (!baseURL) {
        throw new Error("Base URL is not set.");
    }

    // Add json header if body is present
    if (init.body) {
        init.headers = {
            ...init.headers,
            "Content-Type": "application/json",
        };
    }

    // Add cookies if request from server
    if (isServerRequest) {
        init.headers = {
            ...init.headers,
            Cookie: cookies().toString(),
        };
    }

    // Fetch data from the server
    let response;
    try {
        response = await fetch(baseURL + input, init);
    } catch (error) {
        throw new Error("Failed to fetch data");
    }

    // Check HTTP errors
    if (!response.ok) {
        const body = await response.json();
        const errorMessage = body.error || "Unknown error occurred.";

        // Map HTTP status code to error class
        if (response.status in statusCodeErrorMap) {
            throw new statusCodeErrorMap[response.status](errorMessage);
        }

        // Generic error
        throw new Error(
            "Something went wrong: " + response.status + " : " + errorMessage
        );
    }

    return response;
}
