import secrets
import string


def generate_secure_password(length=16):
    characters = string.ascii_letters + string.digits + string.punctuation.replace('"', '').replace("'", '')
    password = ''.join(secrets.choice(characters) for i in range(length))
    return password


def generate_secret_key(length=50):
    characters = string.ascii_letters + string.digits + string.punctuation.replace('"', '').replace("'", '')
    secret_key = ''.join(secrets.choice(characters) for i in range(length))
    return secret_key