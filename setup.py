import os
import subprocess
import sys
from pathlib import Path
import shutil
import argparse
import socket


def generate_env(env):
    python = sys.executable
    subprocess.check_call([str(python), 'gen_env.py', env])


def get_local_ip():
    # Get the local IP address
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # Doesn't matter if the address is reachable or not, we just want to get the local IP
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip


def create_ssl_certificate_mkcert(local_ip):
    cert_path = Path('nginx/ssl/localhost.pem')
    key_path = Path('nginx/ssl/localhost-key.pem')

    if not cert_path.exists() or not key_path.exists():
        cert_path.parent.mkdir(parents=True, exist_ok=True)
        mkcert_cmd = ['mkcert', '-install']

        try:
            subprocess.check_call(mkcert_cmd)
            mkcert_cmd = ['mkcert', '-key-file', str(key_path), '-cert-file', str(cert_path), 'localhost', local_ip]
            subprocess.check_call(mkcert_cmd)
            print(f"SSL certificate created at {cert_path} and key at {key_path}")
        except subprocess.CalledProcessError as e:
            print(f"Failed to create SSL certificate with mkcert: {e}")
    else:
        print(f"SSL certificate already exists at {cert_path} and key at {key_path}")


def get_mkcert_root_ca_path():
    home = Path.home()
    if sys.platform == 'darwin':
        # macOS
        return home / 'Library/Application Support/mkcert' / 'rootCA.pem'
    elif sys.platform == 'win32':
        # Windows
        return Path(os.getenv('APPDATA')) / 'mkcert' / 'rootCA.pem'
    else:
        # Linux
        return home / '.local/share/mkcert' / 'rootCA.pem'


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

    local_ip = get_local_ip()
    print(f"Using local IP: {local_ip}")
    create_ssl_certificate_mkcert(local_ip)
    root_ca_path = get_mkcert_root_ca_path()
    print(f"Transfer the root CA certificate from: {root_ca_path}")

    copy_files(env)


if __name__ == '__main__':
    main()
