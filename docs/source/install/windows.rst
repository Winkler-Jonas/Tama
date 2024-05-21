Windows
-------

1. Intall a packet-manager like choco

   1. Open ``Powershell`` as ``Admin``

   .. code-block:: sh

      # setup environment
      Set-ExecutionPolicy AllSigned
      # confirm with Y or J
      # install choco
      Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
      # restart Powershell (as admin)
      choco install git mkcert

2. Python

   1. Install using choco

   .. code-block:: sh

      choco install -y python312 --override --install-arguments '/quiet InstallAllUsers=1 PrependPath=1 TargetDir=C:\Python3'

   2. Install using python-installer

   - `Python for Windows`_

   - `Python-install-instructions`_

   - Make sure it's added to the PATH

.. _Python for Windows: https://www.python.org/downloads/release/python-3123/
.. _Python-install-instructions: https://www.digitalocean.com/community/tutorials/install-python-windows-10


3. Docker

   - Install `Docker for Windows`_

.. _Docker for Windows: https://desktop.docker.com/win/main/amd64/149282/Docker%20Desktop%20Installer.exe

4. Clone the Repo

   .. code-block:: sh

      git clone https://github.com/Winkler-Jonas/Tama.git

4. Navigate to the project folder

   .. code-block:: sh

      cd Tama/

5. Setup the project

   .. code-block:: sh

      python setup.py dev

6. Start / Stop the App

   - Start the application

   .. code-block:: sh

      # First time build
      docker-compose up --build
      # Afterwards
      docker-compose up

   - Stop the application

   .. code-block:: sh

      docker-compose down
      # If you need to remove volumes
      docker-compose down -v

5. Access the App

   https://localhost

6. To test the App / PWA on your mobile

   1. Copy the ``rootCA.pem`` to your phone
   2. Install the certificate.