import { sendRequest } from "./sendRequest";

interface EmailInviteBody {
    email: string;
    inviteCode: string;
    authorName: string;
    propertyName: string;
}

export async function emailInvite(body: EmailInviteBody) {
    return await sendRequest("email_invite", "POST", {
        email: body.email,
        invite_code: body.inviteCode,
        author_name: body.authorName,
        property_name: body.propertyName,
    });
}
