import os
import subprocess
import sys
import argparse
import shutil

def generate_env(environment):
    subprocess.check_call([sys.executable, 'gen_env.py', environment])

def copy_files(environment):
    nginx_conf_dir = 'nginx'
    if environment == 'dev':
        shutil.copy(os.path.join(nginx_conf_dir, 'nginx_dev.conf'), 'nginx.conf')
        shutil.copy('frontend/dev.Dockerfile', 'frontend/Dockerfile')
    elif environment == 'prod':
        shutil.copy(os.path.join(nginx_conf_dir, 'nginx_prod.conf'), 'nginx.conf')
        shutil.copy('frontend/prod.Dockerfile', 'frontend/Dockerfile')

def main():
    parser = argparse.ArgumentParser(description='Set up the project environment.')
    parser.add_argument('environment', choices=['dev', 'prod'], help='Environment to set up (dev or prod)')
    args = parser.parse_args()

    generate_env(args.environment)
    copy_files(args.environment)

if __name__ == '__main__':
    main()
