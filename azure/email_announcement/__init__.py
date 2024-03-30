import logging

from azure.functions import HttpRequest, HttpResponse
from pydantic import BaseModel, EmailStr, ValidationError
from utils import create_http_error, create_json_response, queue

# Initialise the announcement queue
announcement_queue = queue.get_announcement_queue_proxy()


# Create models for the request body
class EmailObject(BaseModel):
    name: str
    email: EmailStr


class EmailAnnouncementBody(BaseModel):
    emails: list[EmailObject]
    property_name: str
    announcement: str


def main(req: HttpRequest) -> HttpResponse:
    logging.info("Triggered email_announcement function.")

    # Get request body
    try:
        req_body = req.get_json()
        validated_body = EmailAnnouncementBody(**req_body)
    except ValidationError as e:
        return create_http_error(400, f"Invalid request body: ", e)
    except ValueError:
        return create_http_error(400, "Invalid request body.")

    # Add message to queue
    body_dict = validated_body.model_dump()

    for email in body_dict["emails"]:
        queue.add_to_queue(
            announcement_queue,
            {
                "email": email["email"],
                "name": email["name"],
                "property_name": body_dict["property_name"],
                "announcement": body_dict["announcement"],
            },
        )

    logging.info(f"Added message to queue: {body_dict}")

    # Return response
    return create_json_response(200, body_dict)
