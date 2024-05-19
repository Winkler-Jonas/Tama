MAC
---

1. Git + OpenSSL

   .. code-block:: sh

      brew install git openssl

2. Python

   1. Install Python

   .. code-block:: sh

      # check if python is installed
      python3 --version
      # If not installed or version is lower than 3.8
      brew install python

   2. Set python PATH

   - Open ``~/.zshrc`` or ``~/.zprofile``

   .. code-block:: sh

      open -e ~/.zshrc

   - Add this line to the end of the file ``export PATH="$(brew --prefix python)/libexec/bin:$PATH"``

   - Restart the terminal reload the PATH-variable

|

3. Docker

   - Download the installer
   - `Apple-silicon`_
   - `Intel-silicon`_

.. _Apple-silicon: https://desktop.docker.com/mac/main/arm64/Docker.dmg?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-mac-arm64
.. _Intel-silicon: https://desktop.docker.com/mac/main/amd64/Docker.dmg?utm_source=docker&utm_medium=webreferral&utm_campaign=docs-driven-download-mac-amd64

   - Follow Install instructions

4. Clone the Repo

   .. code-block:: sh

      git clone https://github.com/Winkler-Jonas/Tama.git

4. Navigate to the project folder

   .. code-block:: sh

      cd Tama/

5. Setup the project

   .. code-block:: sh

      python setup.py dev

6. Add the SSL-Certificate to your system

   1. Open the Certificate Manager:

      - You can find Keychain Access in ``Applications`` > ``Utilities`` > ``Keychain Access``.

   2. Import Certificate:

      - Drag the ``nginx/ssl/nginx-selfsigned.crt`` file from the project into the Keychain Access window.
      - Alternatively, you can import it using ``File`` > ``Import Items``....

   3. Trust the Certificate:

      - Find the imported certificate in the ``Certificates`` category (usually in the login keychain).
      - Double-click the certificate to open its details.
      - Expand the ``Trust`` section.
      - Set ``When using this certificate`` to ``Always Trust``.
      - Close the certificate details window, and you'll be prompted to enter your password to save the changes.

6. Start / Stop the App

   - Start the application

   .. code-block:: sh

      docker-compose up --build

   - Stop the application

   .. code-block:: sh

      docker-compose down -v

5. Access the App

   https://localhost