import json
import logging
import os

from azure.functions import QueueMessage
from utils import send_email


def main(msg: QueueMessage) -> None:
    logging.info("Invite queue triggered.")

    # Process the message
    try:
        body = json.loads(msg.get_body().decode("utf-8"))
        logging.info(f"Processing message: {body}")
    except Exception as e:
        logging.error(f"Error processing message: {e}")
        raise e

    email = body.get("email")
    invite_code = body.get("invite_code")
    invite_link = os.environ.get("ApplicationURL", "") + "/leases/invite/" + invite_code
    author_name = body.get("author_name")
    property_name = body.get("property_name")

    if any(v is None for v in [email, invite_code, author_name, property_name]):
        logging.error("Missing required fields.")
        raise ValueError("Missing required fields.")

    # Send the email
    logging.info(f"Sending email to {email}.")
    response = send_email(
        to_email=email,
        subject="You've been invited to join a property!",
        content=f"Hi! You've been invited by {author_name} to join property `{property_name}`. "
        f"Your invite code is: {invite_code}."
        f"\nClick here to accept: {invite_link}",
    )

    logging.info(f"Email sent. Response: {response.status_code}")
    if response.status_code != 202:
        raise Exception("Error sending email.")
