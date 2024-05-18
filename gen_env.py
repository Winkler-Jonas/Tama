import os
import secrets
import string
import sys

def generate_secure_password(length=16):
    characters = string.ascii_letters + string.digits + string.punctuation.replace('"', '').replace("'", '')
    password = ''.join(secrets.choice(characters) for i in range(length))
    return password

def generate_secret_key(length=50):
    characters = string.ascii_letters + string.digits + string.punctuation.replace('"', '').replace("'", '')
    secret_key = ''.join(secrets.choice(characters) for i in range(length))
    return secret_key

# Get environment argument
if len(sys.argv) < 2:
    raise ValueError("Please provide an environment (dev or prod).")

environment = sys.argv[1]

# Generate secure random values
secret_key = generate_secret_key()
postgres_user = 'projectuser'
postgres_password = generate_secure_password()

# Determine environment-specific settings
if environment == 'dev':
    environment_setting = 'development'
    nginx_port = 8080
elif environment == 'prod':
    environment_setting = 'production'
    nginx_port = 80
else:
    raise ValueError("Invalid environment. Use 'dev' or 'prod'.")

# Create the .env file content
env_content = f"""
SECRET_KEY="{secret_key}"
POSTGRES_DB=myproject
POSTGRES_USER={postgres_user}
POSTGRES_PASSWORD="{postgres_password}"
ENVIRONMENT={environment_setting}
NGINX_PORT={nginx_port}
"""

env_path = '.env'

# Always overwrite the .env file with the new content
with open(env_path, 'w') as env_file:
    env_file.write(env_content.strip())
print(f"{env_path} has been created/overwritten with a new SECRET_KEY and PostgreSQL credentials.")

# Optionally, output the generated content for verification
print("Generated .env content:")
print(env_content)
