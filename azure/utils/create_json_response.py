import json

from azure.functions import HttpResponse


def create_json_response(status_code: int, body: dict):
    """
    Create a JSON response with the given body and status code.

    Args:
        body (dict): The JSON body to be included in the response.
        status_code (int, optional): The HTTP status code of the response.

    Returns:
        HttpResponse: The JSON response object.
    """
    return HttpResponse(
        body=json.dumps(body),
        status_code=status_code,
        mimetype="application/json",
    )
