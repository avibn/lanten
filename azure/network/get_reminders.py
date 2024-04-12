import datetime
import os
from typing import List

import requests

# Base URL
base_url = os.getenv("BackendBaseUrl")
auth_token = os.getenv("BackendKey")


# Data classes for type hinting
class PaymentData:
    """
    Represents payment data.

    Attributes:
        payment_id (int): The ID of the payment.
        payment_amount (float): The amount of the payment.
        payment_name (str): The name of the payment.
        payment_description (str): The description of the payment.
        payment_type (str): The type of the payment.
        payment_date (str): The date of the payment.
    """

    def __init__(
        self,
        payment_id,
        payment_amount,
        payment_name,
        payment_description,
        payment_type,
        payment_date,
    ):
        self.payment_id = payment_id
        self.payment_amount = payment_amount
        self.payment_name = payment_name
        self.payment_description = (
            "" if payment_description is None else f" ({payment_description})"
        )
        self.payment_type = payment_type

        # Convert datetime to just date text
        payment_datetime = datetime.datetime.strptime(
            payment_date, "%Y-%m-%dT%H:%M:%S.%fZ"
        )
        self.payment_date = payment_datetime.strftime("%d-%m-%Y")

    def __str__(self):
        return f"{self.payment_id} {self.payment_amount} {self.payment_name} {self.payment_description} {self.payment_type} {self.payment_date}"

    def __repr__(self):
        return self.__str__()


class TenantData:
    """
    Represents tenant data with a name and email.

    Attributes:
        tenant_name (str): The name of the tenant.
        tenant_email (str): The email of the tenant.
    """

    def __init__(self, tenant_name, tenant_email):
        self.tenant_name = tenant_name
        self.tenant_email = tenant_email

    def __str__(self):
        return f"{self.tenant_name} {self.tenant_email}"

    def __repr__(self):
        return self.__str__()


def get_todays_reminders() -> dict[PaymentData, List[TenantData]]:
    """
    Retrieves today's reminders from the database and returns a dictionary mapping PaymentData instances to a list of TenantData instances.

    Returns:
        A dictionary mapping PaymentData instances to a list of TenantData instances.
    """
    # reminders = database.execute_sql(project_reminders_query)
    # response = reminders.fetchall()

    if auth_token is None or base_url is None:
        raise ValueError("Base URL and auth token must be set.")

    response = requests.get(
        f"{base_url}/reminders/all",
        headers={"Authorization": auth_token},
    ).json()

    payment_to_tenants = {}
    for resp in response:
        # Create PaymentData instance to store payment data
        payment_instance = PaymentData(
            resp.get("paymentId"),
            resp.get("amount"),
            resp.get("name"),
            resp.get("description"),
            resp.get("type"),
            resp.get("paymentDate"),
        )

        # Get tenants emails and names
        tenants = [
            TenantData(tenant.get("name"), tenant.get("email"))
            for tenant in resp.get("tenants")
        ]

        # Assign tenants to payment
        payment_to_tenants[payment_instance] = tenants

    return payment_to_tenants
