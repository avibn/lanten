import json
import logging
import os

from azure.functions import QueueMessage
from jinja2 import Environment, FileSystemLoader
from utils import send_email

env = Environment(loader=FileSystemLoader("email_templates"))
template = env.get_template("reminder.html")


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

    if any(v is None for v in [email, name, reminders]):
        logging.error("Missing required fields.")
        raise ValueError("Missing required fields.")

    # Create the email content
    text_reminders = "\n".join(
        f"{reminder['date']}: £{reminder['amount']} for {reminder['name']}{reminder['description']}"
        for reminder in reminders
    )

    content = template.render(
        name=name,
        num_reminders=len(reminders),
        reminders=text_reminders,
        home_link=os.environ.get("ApplicationURL", ""),
    )

    # Send the email
    logging.info(f"Sending email to {email}.")
    response = send_email(
        to_email=email,
        subject="Today's Reminders",
        content=content,
    )

    # Log the response
    logging.info(f"Email sent. Response: {response.status_code}")
    if response.status_code != 202:
        raise Exception("Error sending email.")
