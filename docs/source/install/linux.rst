Linux
-----

1. Python Git + OpenSSL

   .. code-block:: sh

      sudo apt update
      sudo apt install git openssl python3

2. Install Docker + Compose

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

3. Clone the Repo

   .. code-block:: sh

      git clone https://github.com/Winkler-Jonas/Tama.git

4. Navigate to the project folder

   .. code-block:: sh

      cd Tama/

5. Setup the project

   .. code-block:: sh

      python3 setup.py dev

6. Add the SSL-Certificate to your system (make sure you are inside the project-dir)

   .. code-block:: sh

      sudo cp nginx/ssl/nginx-selfsigned.crt /usr/local/share/ca-certificates/nginx-selfsigned.crt
      sudo update-ca-certificates

6. Start / Stop the App

   - Start the application

   .. code-block:: sh

      docker-compose up --build

   - Stop the application

   .. code-block:: sh

      docker-compose down -v

5. Access the App

   https://localhost