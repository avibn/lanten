import base64
import json
import os

from azure.storage.queue import QueueClient


def add_to_queue(queue: QueueClient, message: dict):
    """
    Adds a message to the specified queue.

    Args:
        queue (QueueClient): The queue client object.
        message (dict): The message to be added to the queue.

    Returns:
        None
    """
    queue.send_message(base64.b64encode(json.dumps(message).encode()).decode())


def get_invite_queue_proxy() -> QueueClient:
    """
    Retrieves a proxy object for the invite queue.

    Returns:
        A QueueClient object representing the invite queue proxy.
    """
    return QueueClient.from_connection_string(
        os.environ["AzureStorageConnectionString"], os.environ["InviteQueueName"]
    )


def get_reminder_queue_proxy() -> QueueClient:
    """
    Retrieves a proxy object for the reminder queue.

    Returns:
        A QueueClient object representing the reminder queue proxy.
    """
    return QueueClient.from_connection_string(
        os.environ["AzureStorageConnectionString"], os.environ["ReminderQueueName"]
    )
