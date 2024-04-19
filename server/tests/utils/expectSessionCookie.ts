import request from "supertest";

export function expectSessionCookie(response: request.Response, not = false) {
    const checkArray = expect.arrayContaining([
        expect.stringContaining("connect.sid="),
    ]);
    const checkArrayEmpty = expect.arrayContaining([
        expect.stringContaining("connect.sid=;"),
    ]);

    if (not) {
        expect(response.headers["set-cookie"]).toEqual(checkArrayEmpty);
    } else {
        expect(response.headers["set-cookie"]).toEqual(checkArray);
    }
}
