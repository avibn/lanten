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
    name = body.get("name")
    property_name = body.get("property_name")
    announcement = body.get("announcement")

    if any(v is None for v in [email, name, property_name, announcement]):
        logging.error("Missing required fields.")
        raise ValueError("Missing required fields.")

    # Send the email
    logging.info(f"Sending email to {email}.")
    response = send_email(
        to_email=email,
        subject=f"New announcement for {property_name}!",
        content=f"Hi {name}! There is a new announcement for {property_name}:\n{announcement}",
    )

    # Log the response
    logging.info(f"Email sent. Response: {response.status_code}")
    if response.status_code != 202:
        raise Exception("Error sending email.")
