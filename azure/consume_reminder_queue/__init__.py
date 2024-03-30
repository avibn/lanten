import json
import logging

from azure.functions import QueueMessage
from utils import send_email

# The email template
email_text = """
Hello {name},
You have {num_reminders} reminders today:
{reminders}
"""


def main(msg: QueueMessage) -> None:
    logging.info("Reminder queue triggered.")

    # Process the message
    try:
        body = json.loads(msg.get_body().decode("utf-8"))
        logging.info(f"Processing message: {body}")
    except Exception as e:
        logging.error(f"Error processing message: {e}")
        raise e

    # Parse the message body
    email = body.get("email")
    name = body.get("name")
    reminders: list[dict] = body.get("reminders")

    # Create the email content
    text_reminders = "\n".join(
        f"{reminder['date']}: £{reminder['amount']} for {reminder['name']}{reminder['description']}"
        for reminder in reminders
    )
    email_content = email_text.format(
        name=name, num_reminders=len(reminders), reminders=text_reminders
    )

    # Send the email
    logging.info(f"Sending email to {email}.")
    response = send_email(
        to_email=email,
        subject="Your reminders for today!",
        content=email_content,
    )

    # Log the response
    logging.info(f"Email sent. Response: {response.status_code}")
    if response.status_code != 202:
        raise Exception("Error sending email.")
