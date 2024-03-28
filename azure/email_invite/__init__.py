import logging

from azure.functions import HttpRequest, HttpResponse
from pydantic import BaseModel, EmailStr, ValidationError
from utils import create_http_error, create_json_response, queue

# Initialise the invite queue
invite_queue = queue.get_invite_queue_proxy()


class EmailInviteBody(BaseModel):
    email: EmailStr
    invite_code: str
    author_name: str
    property_name: str


def main(req: HttpRequest) -> HttpResponse:
    logging.info("Triggered email_invite function.")

    # Get request body
    try:
        req_body = req.get_json()
        validated_body = EmailInviteBody(**req_body)
    except ValidationError as e:
        return create_http_error(400, f"Invalid request body: ", e)
    except ValueError:
        return create_http_error(400, "Invalid request body.")

    # Add message to queue
    body_dict = validated_body.model_dump()
    queue.add_to_queue(invite_queue, body_dict)
    logging.info(f"Added message to queue: {body_dict}")

    # Return response
    return create_json_response(200, body_dict)
