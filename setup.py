import os
import subprocess
import sys
import urllib
from pathlib import Path
import argparse
import socket
from typing import Dict

import project_setup as ps


production_server: Dict[str, str] = {
    'domain_ip': '130.162.57.25',
    'domain_name': 'tamado.app'
}


def create_global_env(env, api_key: str, local_ip: str):
    allowed_hosts: str = f"localhost,{local_ip}" if env == 'dev' else ','.join(production_server.values())

    g_env: ps.Environment = ps.Environment(Path('.env'))
    g_env.clear_env()
    g_env.add_variable('django_secret_key', urllib.parse.quote(ps.generate_secret_key()))
    g_env.add_variable('postgres_db', 'tamaProject')
    g_env.add_variable('postgres_user', 'tamaUser')
    g_env.add_variable('postgres_password', ps.generate_secure_password(), quoted=True)
    g_env.add_variable('environment', 'development' if env == 'dev' else 'production')
    g_env.add_variable('dev_api_key', urllib.parse.quote(api_key))

    # Django allowed Hosts
    g_env.add_variable('django_allowed_hosts', allowed_hosts)

    # Django email (prod-password)
    g_env.add_variable('django_mail_pwd', '')

    # Django asgi settings
    g_env.add_variable('django_settings_module', 'tama_backend.settings')

    # Nginx server_name
    g_env.add_variable('nginx_server_name',
                       ' '.join([name for name in allowed_hosts.split(',')]),
                       quoted=True)
    g_env.add_variable('nginx_server_domain', production_server.get('domain_name'))

    g_env.write_to_file()


def create_frontend_env(env, api_key: str,  local_ip: str):
    f_env: ps.Environment = ps.Environment(Path('./frontend/.env'))
    f_env.clear_env()
    f_env.add_variable('vite_api_key', urllib.parse.quote(api_key))

    f_env.add_variable('vite_static_url', '/static')
    f_env.add_variable('vite_media_url', '/media')

    if env == 'dev':
        f_env.add_variable('vite_hmr_host', local_ip)
        f_env.add_variable('vite_hmr_port', '443')
    f_env.write_to_file()


def get_local_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(("8.8.8.8", 80))
        ip = s.getsockname()[0]
    except Exception:
        print("Error: Could not retrieve Host-IP!")
        ip = "127.0.0.1"
    finally:
        s.close()
    return ip


def create_ssl_certificate_mkcert(local_ip):
    cert_path = Path('nginx/ssl/tamado.app.cert.pem').resolve()
    key_path = Path('nginx/ssl/tamado.app.key.pem').resolve()

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


def main():
    parser = argparse.ArgumentParser(description='Set up the project environment.')
    parser.add_argument('environment', choices=['dev', 'prod'], help='Environment to set up (dev or prod)')
    args = parser.parse_args()

    env = args.environment

    api_key: str = ps.generate_secret_key()
    local_ip = get_local_ip()

    create_global_env(env, api_key, local_ip)
    create_frontend_env(env, api_key, local_ip)

    create_ssl_certificate_mkcert(local_ip)
    root_ca_path = get_mkcert_root_ca_path()
    print(f"Transfer the root CA certificate from: {root_ca_path} to your phone or tablet..")


if __name__ == '__main__':
    main()
