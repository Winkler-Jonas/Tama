Linux
-----

1. Install Python + Git

   .. code-block:: sh

      sudo apt update
      sudo apt install git python3

2. Install mkCert

   .. code-block:: sh

      sudo apt install libnss3-tools
      curl -JLO "https://dl.filippo.io/mkcert/latest?for=linux/amd64"
      chmod +x mkcert-v*-linux-amd64
      sudo cp mkcert-v*-linux-amd64 /usr/local/bin/mkcert

3. Install Docker + Compose

   1. Docker

   .. code-block:: sh

      sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
      curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
      sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
      sudo apt-get update
      sudo apt-get install -y docker-ce

   2. Docker Compose

   .. code-block:: sh

      sudo curl -L "https://github.com/docker/compose/releases/download/$(curl -s https://api.github.com/repos/docker/compose/releases/latest | grep -Po '"tag_name": "\K.*?(?=")')/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
      sudo chmod +x /usr/local/bin/docker-compose

   3. Add User to docker-group

   .. code-block:: sh

      sudo groupadd docker
      sudo usermod -aG docker $USER

4. Clone the Repo

   .. code-block:: sh

      git clone https://github.com/Winkler-Jonas/Tama.git

5. Navigate to the project folder

   .. code-block:: sh

      cd Tama/

6. Setup the project

   .. code-block:: sh

      python3 setup.py dev

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
