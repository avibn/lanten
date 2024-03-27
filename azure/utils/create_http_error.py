import json

from azure.functions import HttpResponse
from pydantic import ValidationError


def format_validation_error(e: ValidationError) -> str:
    """
    Formats the validation error into a string.

    Args:
        e (ValidationError): The validation error object.

    Returns:
        str: The formatted validation error string.
    """
    return "  |   ".join(f"{error['loc'][0]}: {error['msg']}" for error in e.errors())


def create_http_error(
    status_code: int = 400,
    message: str = "",
    error_to_append: Exception = None,
) -> HttpResponse:
    """
    Create an HTTP error response with the given status code and message.

    Args:
        status_code (int): The HTTP status code for the error response.
        message (str): The error message to be included in the response.
        error_to_append (Exception): An optional error to append to the message.

    Returns:
        HttpResponse: An HTTP response object with the specified status code and message.
    """

    if isinstance(error_to_append, ValidationError):
        message += format_validation_error(error_to_append)
    elif error_to_append:
        message += str(error_to_append)

    return HttpResponse(
        body=json.dumps({"error": message}),
        status_code=status_code,
        mimetype="application/json",
    )
