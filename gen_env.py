import os
import secrets
import string
from django.core.management.utils import get_random_secret_key

# Function to generate a secure random password
def generate_secure_password(length=16):
    characters = string.ascii_letters + string.digits + string.punctuation
    return ''.join(secrets.choice(characters) for i in range(length))

# Generate secure random values
secret_key = get_random_secret_key()
postgres_user = 'projectuser'
postgres_password = generate_secure_password()

# Create the .env file content
env_content = f"""
SECRET_KEY={secret_key}
POSTGRES_DB=myproject
POSTGRES_USER={postgres_user}
POSTGRES_PASSWORD={postgres_password}
"""

env_path = '.env'

# Check if .env file already exists
if os.path.exists(env_path):
    print(f"{env_path} already exists. Skipping creation.")
else:
    with open(env_path, 'w') as env_file:
        env_file.write(env_content.strip())
    print(f"{env_path} has been created with a new SECRET_KEY and PostgreSQL credentials.")

# Optionally, output the generated content for verification
print("Generated .env content:")
print(env_content)

