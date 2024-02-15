import { cookies } from "next/headers";
import { fetchData } from "./fetch-data";

/**
 * Fetches data from the server (with cookies from next/headers).
 * @param input - The URL to fetch.
 * @param init - The optional RequestInit object for additional configuration.
 * @returns A Promise that resolves to the Response object representing the fetched data.
 * @throws Error if the base URL is not set, if fetching data fails, or if an HTTP error occurs.
 */
export async function fetchDataServer(
    input: RequestInfo,
    init: RequestInit = {}
) {
    init.headers = {
        ...init.headers,
        Cookie: cookies().toString(),
    };

    return fetchData(input, init);
}
