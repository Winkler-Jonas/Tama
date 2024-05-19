import os
import subprocess
import sys
from pathlib import Path
import shutil
import argparse

def generate_env(env):
    python = sys.executable
    subprocess.check_call([str(python), 'gen_env.py', env])

def create_ssl_certificate():
    cert_path = Path('nginx/ssl/nginx-selfsigned.crt')
    key_path = Path('nginx/ssl/nginx-selfsigned.key')

    if not cert_path.exists() or not key_path.exists():
        cert_path.parent.mkdir(parents=True, exist_ok=True)
        openssl_cmd = [
            'openssl', 'req', '-x509', '-nodes', '-days', '365', '-newkey', 'rsa:2048',
            '-keyout', str(key_path), '-out', str(cert_path),
            '-subj', '/CN=localhost'
        ]

        try:
            subprocess.check_call(openssl_cmd)
            print(f"SSL certificate created at {cert_path} and key at {key_path}")
        except subprocess.CalledProcessError as e:
            print(f"Failed to create SSL certificate: {e}")
    else:
        print(f"SSL certificate already exists at {cert_path} and key at {key_path}")

def copy_files(env):
    nginx_conf_dir = 'nginx'
    if env == 'dev':
        shutil.copy(Path(nginx_conf_dir, 'nginx_dev.conf'), 'nginx.conf')
        shutil.copy('frontend/dev.Dockerfile', 'frontend/Dockerfile')
    elif env == 'prod':
        shutil.copy(Path(nginx_conf_dir, 'nginx_prod.conf'), 'nginx.conf')
        shutil.copy('frontend/prod.Dockerfile', 'frontend/Dockerfile')

def main():
    parser = argparse.ArgumentParser(description='Set up the project environment.')
    parser.add_argument('environment', choices=['dev', 'prod'], help='Environment to set up (dev or prod)')
    args = parser.parse_args()

    env = args.environment

    generate_env(env)
    create_ssl_certificate()
    copy_files(env)

if __name__ == '__main__':
    main()
