import { sendRequest } from "./sendRequest";

interface EmailInviteBody {
    email: string;
    inviteCode: string;
    authorName: string;
    propertyName: string;
}

/**
 * Sends an email invitation.
 *
 * @param body - The email invitation details.
 * @returns A promise that resolves when the request is sent.
 */
export async function emailInvite(body: EmailInviteBody) {
    return await sendRequest("email_invite", "POST", {
        email: body.email,
        invite_code: body.inviteCode,
        author_name: body.authorName,
        property_name: body.propertyName,
    });
}

interface EmailAnnouncementBody {
    emails: {
        email: string;
        name: string;
    }[];
    announcementContent: string;
    propertyName: string;
}

/**
 * Sends an email announcement.
 *
 * @param body - The email announcement body.
 * @returns A promise that resolves when the request is sent.
 */
export async function emailAnnouncement(body: EmailAnnouncementBody) {
    return await sendRequest("email_announcement", "POST", {
        emails: body.emails,
        announcement: body.announcementContent,
        property_name: body.propertyName,
    });
}
