from google.cloud import secretmanager
import environ

env = environ.Env()
environ.Env.read_env()


def get_secret(secret_id, version_id="latest"):
    project_id = env("GOOGLE_PROJECT_ID")
    client = secretmanager.SecretManagerServiceClient()
    name = f"projects/{project_id}/secrets/{secret_id}/versions/{version_id}"
    response = client.access_secret_version(name=name)
    return response.payload.data.decode("UTF-8")
