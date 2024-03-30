from typing import List

from .models import Lease, LeaseTenant, Payment, User, database

project_reminders_query = """
-- Recurring reminders
WITH recurring_dates AS (
  SELECT p."id", g.date::date
  FROM "Payment" p
  CROSS JOIN LATERAL
  generate_series(
    p."paymentDate", 
    (CURRENT_DATE AT TIME ZONE 'UTC') + INTERVAL '10 days', 
    CASE 
      WHEN p."recurringInterval" = 'DAILY' THEN '1 day'::interval
      WHEN p."recurringInterval" = 'WEEKLY' THEN '7 days'::interval
      WHEN p."recurringInterval" = 'MONTHLY' THEN '1 month'::interval
      WHEN p."recurringInterval" = 'YEARLY' THEN '1 year'::interval
    END
  ) g(date)
  WHERE p."recurringInterval" != 'NONE'
)
SELECT p.*, r.*
FROM recurring_dates rd
JOIN "Payment" p ON rd."id" = p."id"
JOIN "Reminder" r ON p."id" = r."paymentId"
WHERE DATE(rd.date) - r."daysBefore" = (CURRENT_DATE AT TIME ZONE 'UTC')

UNION

-- Non-recurring reminders
SELECT p.*, r.*
FROM "Payment" p
JOIN "Reminder" r ON p."id" = r."paymentId"
WHERE DATE(p."paymentDate") - r."daysBefore" = CURRENT_DATE;
"""


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
        self.payment_description = payment_description
        self.payment_type = payment_type
        self.payment_date = payment_date

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
    reminders = database.execute_sql(project_reminders_query)
    response = reminders.fetchall()

    payment_to_tenants = {}
    for resp in response:
        # Create PaymentData instance to store payment data
        (
            payment_id,
            payment_amount,
            payment_name,
            payment_description,
            payment_type,
            payment_date,
            *rest,
        ) = resp

        payment_instance = PaymentData(
            payment_id,
            payment_amount,
            payment_name,
            payment_description,
            payment_type,
            payment_date,
        )

        # Get tenants emails and names
        tenants = (
            User.select(User.email, User.name)
            .join(LeaseTenant)
            .join(Lease)
            .join(Payment)
            .where(Payment.id == payment_id)
            .distinct()  # This is important to avoid duplicates
        )

        tenants = [TenantData(tenant.name, tenant.email) for tenant in tenants]

        # Assign tenants to payment
        payment_to_tenants[payment_instance] = tenants

    return payment_to_tenants
