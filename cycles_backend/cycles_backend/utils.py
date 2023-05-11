import os
import base64
import json
from google.cloud import secretmanager


def get_secret(version_id="latest"):
    secret_id = 'GCS_CREDENTIALS'
    project_id = os.environ.get("GS_PROJECT_ID")
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    response = client.access_secret_version(name=name)
    return response.payload.data.decode("UTF-8")
