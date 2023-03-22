import firebase_admin
from firebase_admin import credentials
import environ

env = environ.Env()
# reading .env file
environ.Env.read_env()

cred = credentials.Certificate({
    "type": env("GOOGLE_TYPE"),
    "project_id": env("GOOGLE_PROJECT_ID"),
    "private_key_id": env('GOOGLE_PRIVATE_KEY_ID'),
    "private_key": env("GOOGLE_PRIVATE_KEY"),
    "client_email": env("GOOGLE_CLIENT_EMAIL"),
    "client_id": env("GOOGLE_CLIENT_ID"),
    "auth_uri": env("GOOGLE_AUTH_URI"),
    "token_uri": env("GOOGLE_TOKEN_URI"),
    "auth_provider_x509_cert_url": env("GOOGLE_AUTH_PROVIDER_x509_CERT_URL"),
    "client_x509_cert_url": env("GOOGLE_CLIENT_x509_CERT_URL")
})

firebase_admin.initialize_app(cred)
