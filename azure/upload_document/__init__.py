import asyncio
import logging

from azure.functions import HttpRequest, HttpResponse
from utils import create_http_error, create_json_response

SUPPORTED_DOCUMENTS = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]
MAX_DOCUMENT_SIZE = 15 * 1024 * 1024  # 15MB


async def create_upload_tasks(files: list):
    """
    Create upload tasks for a list of files.

    Args:
        files (list): A list of files to be uploaded.

    Returns:
        A coroutine that returns a list of URLs for the uploaded files.
    """

    # Function to upload a document to the blob storage
    async def upload_document(file) -> str:
        content = file["content"]
        # Upload the file to the blob storage
        try:
            # todo
            pass
        except Exception as e:
            logging.error(f"Failed to upload file: {file['filename']}. Error: {e}")
            file["error"] = str(e)
            return None

        # todo:: Add url to object
        file["url"] = "https://example.com/image.jpg"
        file["blob_name"] = "image.jpg"
        del file["content"]

        return file

    # Create a task for each file
    task = []
    for file in files:
        task.append(upload_document(file))

    # Wait for all tasks to complete
    return await asyncio.gather(*task)


def main(req: HttpRequest) -> HttpResponse:
    logging.info("Triggered upload_document function.")

    # Check if the request has a file
    files = req.files.getlist("files[]")
    if not files:
        return create_http_error(400, "No files found in request.")

    upload_files = []

    if len(files) == 1 and files[0].filename == "":
        return create_http_error(400, "No files found in request.")

    for file in files:
        # Check if the file is a supported document type
        if file.mimetype not in SUPPORTED_DOCUMENTS:
            return create_http_error(400, f"Unsupported document type: {file.mimetype}")

        # Check if the file is too large
        content = file.read()
        if len(content) > MAX_DOCUMENT_SIZE:
            return create_http_error(
                400,
                f"Document too large: {file.filename} (max size: {MAX_DOCUMENT_SIZE//1024//1024}MB)",
            )

        upload_files.append(
            {
                "filename": file.filename,
                "size": len(content),
                "mimetype": file.mimetype,
                "content": content,
            }
        )

    # Upload the files asynchronously
    asyncio.run(create_upload_tasks(upload_files))

    return create_json_response(200, {"files": upload_files})
