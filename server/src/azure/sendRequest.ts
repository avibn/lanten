import axios, { AxiosRequestConfig } from "axios";

import env from "../utils/validateEnv";

export async function sendRequest(
    endpoint: string,
    method: string,
    body: object,
    headers: object = {
        "Content-Type": "application/json",
    }
) {
    const url = `${env.AZURE_FUNCTION_URL}/${endpoint}?code=${env.AZURE_FUNCTION_TOKEN}`;
    const options: AxiosRequestConfig = {
        method: method,
        url: url,
        headers,
        data: body,
        responseType: "json",
    };
    console.log("Sending request to", url);

    const response = await axios(options);
    console.log("Response from", url, response.status, response.data);
    return response.data;
}
