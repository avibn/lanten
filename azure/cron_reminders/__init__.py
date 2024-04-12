import logging
from datetime import UTC, datetime, timezone

from azure.functions import TimerRequest
from network.get_reminders import get_todays_reminders
from utils import queue

# Get the queue proxy
reminder_queue = queue.get_reminder_queue_proxy()


def main(mytimer: TimerRequest) -> None:
    utc_timestamp = datetime.now(UTC).replace(tzinfo=timezone.utc).isoformat()

    if mytimer.past_due:
        logging.info("The timer is past due!")

    # Get reminders to send to users
    reminders = get_todays_reminders()

    # Dicts to store reminders and user data
    user_to_reminder = {}
    email_to_name = {}

    # Loop through reminders and add to dicts
    for payment_data, tenant_data in reminders.items():
        for tenant in tenant_data:
            user_to_reminder.setdefault(tenant.tenant_email, []).append(payment_data)
            email_to_name[tenant.tenant_email] = tenant.tenant_name

    # Loop through users and send reminders (add to queue)
    for email, reminders in user_to_reminder.items():
        logging.info(
            f"Sending reminders to {email} ({email_to_name[email]}): {len(reminders)}"
        )

        # Add to email queue
        queue.add_to_queue(
            reminder_queue,
            {
                "email": email,
                "name": email_to_name[email],
                "reminders": [
                    {
                        "name": reminder.payment_name,
                        "description": reminder.payment_description,
                        "amount": reminder.payment_amount,
                        "date": reminder.payment_date,
                    }
                    for reminder in reminders
                ],
            },
        )
        logging.info(f"Added email to queue for {email}")

    logging.info("Python timer trigger function ran at %s", utc_timestamp)
