import os
import subprocess
import sys

def create_virtualenv():
    if os.name == 'nt':
        python = 'python'
    else:
        python = 'python3'

    subprocess.check_call([python, '-m', 'venv', 'venv'])

def install_dependencies():
    if os.name == 'nt':
        pip = os.path.join('venv', 'Scripts', 'pip.exe')
    else:
        pip = os.path.join('venv', 'bin', 'pip3')

    subprocess.check_call([pip, 'install', '-r', 'backend/tama_backend/requirements.txt'])

def generate_env():
    python = os.path.join('venv', 'Scripts' if os.name == 'nt' else 'bin', 'python')
    subprocess.check_call([python, 'gen_env.py'])

def main():
    create_virtualenv()
    install_dependencies()
    generate_env()

if __name__ == '__main__':
    main()

