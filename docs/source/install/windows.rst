Windows
-------

1. Git + OpenSSL

   - Install `git-cli`_ or use an IDE like Webstorm/VSCode.

.. _git-cli: https://git-scm.com/download/win

2. Python

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

6. Add the SSL-Certificate to your system

   1. Open the Certificate Manager:

      - Press ``Win + R``, type ``mmc``, and press ``Enter``.
      - Go to ``File`` > ``Add/Remove Snap-in``....
      - Select ``Certificates`` and click ``Add``.
      - Choose ``Computer account`` and click ``Next``.
      - Select ``Local computer`` and click ``Finish``.

   2. Import Certificate:

      - Expand ``Certificates (Local Computer)`` > ``Trusted Root Certification Authorities``.
      - Right-click on ``Certificates``, then choose ``All Tasks`` > ``Import``....
      - Follow the wizard to import the ``nginx/ssl/nginx-selfsigned.crt`` file from the project.

   3. Complete the Import:

      - Finish the wizard, and you should see the certificate listed under ``Certificates``.


6. Start / Stop the App

   - Start the application

   .. code-block:: sh

      docker-compose up --build

   - Stop the application

   .. code-block:: sh

      docker-compose down -v

5. Access the App

   https://localhost