import os

import sendgrid
from sendgrid.helpers.mail import Content, Email, Mail, To

# Initialize the SendGrid client
sendgrid_key = os.environ.get("SendGridApiKey")
sg = sendgrid.SendGridAPIClient(sendgrid_key)


def send_email(
    to_email: str,
    subject: str,
    content: str,
    content_type: str = "text/plain",
    from_email: str = "updates@lanten.site",
):
    # Create the email objects
    from_email = Email(from_email)
    to_email = To(to_email)
    content = Content(content_type, content)

    # Create the full email object
    mail = Mail(from_email, to_email, subject, content)
    mail_json = mail.get()

    # Send the email
    response = sg.client.mail.send.post(request_body=mail_json)

    return response
