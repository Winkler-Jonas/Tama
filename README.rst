TAMA
====

Setup
-----

1. Clone repository:

    .. code-block:: sh

        git clone https://github.com/Winkler-Jonas/Tama.git
        cd Tama

2. Install python and docker.io

   Installation Instructions for Python, Docker, and Docker Compose
   ================================================================

   Ubuntu (Linux)
   --------------

   Install Python
   ~~~~~~~~~~~~~~
   1. **Update the package list:**

      .. code-block:: bash

         sudo apt update

   2. **Install Python 3:**

      .. code-block:: bash

         sudo apt install python3

   3. **Install pip (Python package manager):**

      .. code-block:: bash

         sudo apt install python3-pip

   4. **Verify the installation:**

      .. code-block:: bash

         python3 --version
         pip3 --version

   Install Docker
   ~~~~~~~~~~~~~~
   1. **Update the package list:**

      .. code-block:: bash

         sudo apt update

   2. **Install necessary packages:**

      .. code-block:: bash

         sudo apt install apt-transport-https ca-certificates curl software-properties-common

   3. **Add Docker’s GPG key:**

      .. code-block:: bash

         curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

   4. **Add Docker APT repository:**

      .. code-block:: bash

         echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

   5. **Update the package list again:**

      .. code-block:: bash

         sudo apt update

   6. **Install Docker:**

      .. code-block:: bash

         sudo apt install docker-ce

   7. **Start and enable Docker:**

      .. code-block:: bash

         sudo systemctl start docker
         sudo systemctl enable docker

   8. **Add your user to the Docker group:**

      .. code-block:: bash

         sudo usermod -aG docker $USER

   9. **Log out and log back in so that your group membership is re-evaluated.**

   10. **Verify Docker installation:**

      .. code-block:: bash

         docker --version

   Install Docker Compose
   ~~~~~~~~~~~~~~~~~~~~~~
   1. **Download the Docker Compose binary:**

      .. code-block:: bash

         sudo curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

   2. **Apply executable permissions to the binary:**

      .. code-block:: bash

         sudo chmod +x /usr/local/bin/docker-compose

   3. **Verify Docker Compose installation:**

      .. code-block:: bash

         docker-compose --version

   Windows
   -------

   Install Python
   ~~~~~~~~~~~~~~
   1. **Download the Python installer:**
      Go to the `Python official website <https://www.python.org/downloads/>`_ and download the latest installer.

   2. **Run the installer:**
      Make sure to check the box "Add Python to PATH" during installation.

   3. **Verify the installation:**
      Open Command Prompt and run:

      .. code-block:: cmd

         python --version
         pip --version

   Install Docker
   ~~~~~~~~~~~~~~
   1. **Download Docker Desktop for Windows:**
      Go to the `Docker Desktop download page <https://www.docker.com/products/docker-desktop/>`_ and download the installer.

   2. **Run the installer:**
      Follow the installation instructions.

   3. **Start Docker Desktop:**
      Search for Docker Desktop and start the application.

   4. **Verify Docker installation:**
      Open Command Prompt or PowerShell and run:

      .. code-block:: cmd

         docker --version

   Install Docker Compose
   ~~~~~~~~~~~~~~~~~~~~~~
   Docker Compose is included with Docker Desktop. You can verify the installation by running:

      .. code-block:: cmd

         docker-compose --version

   macOS
   -----

   Install Python
   ~~~~~~~~~~~~~~
   1. **Install Homebrew (if not already installed):**
      Open Terminal and run:

      .. code-block:: bash

         /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

   2. **Install Python using Homebrew:**

      .. code-block:: bash

         brew install python

   3. **Verify the installation:**

      .. code-block:: bash

         python3 --version
         pip3 --version

   Install Docker
   ~~~~~~~~~~~~~~
   1. **Download Docker Desktop for Mac:**
      Go to the `Docker Desktop download page <https://www.docker.com/products/docker-desktop/>`_ and download the installer.

   2. **Run the installer:**
      Follow the installation instructions.

   3. **Start Docker Desktop:**
      Open Docker Desktop from the Applications folder.

   4. **Verify Docker installation:**
      Open Terminal and run:

      .. code-block:: bash

         docker --version

   Install Docker Compose
   ~~~~~~~~~~~~~~~~~~~~~~
   Docker Compose is included with Docker Desktop. You can verify the installation by running:

      .. code-block:: bash

         docker-compose --version


3. Setup project

    .. code-block:: sh

        # dev
        python3 setup.py dev
        # prod
        python3 setup.py prod

4. Starting Server

    .. code-block:: sh

        docker-compose up --build

5. Resetting Server:

    .. code-block:: sh

        docker-compose down -v

6. Accessing the application:

    - Dev: `http://localhost:8080 <http://localhost:8080>`_
    - Prod: `http://130.61.49.116/ <http://130.61.49.116/>`_
