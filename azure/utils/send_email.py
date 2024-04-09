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
    content_type: str = "text/html",
    from_email: str = "updates@lanten.site",
):
    """
    Sends an email using the SendGrid API.

    Args:
        to_email (str): The recipient's email address.
        subject (str): The subject of the email.
        content (str): The content of the email.
        content_type (str, optional): The content type of the email. Defaults to "text/plain".
        from_email (str, optional): The sender's email address. Defaults to "updates@lanten.site".

    Returns:
        Request: The response from the SendGrid API.

    """
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
