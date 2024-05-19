TAMA
====

How to setup
------------

1. Clone repository:

    ..code-block: sh

        git clone https://github.com/Winkler-Jonas/Tama.git
       cd Tama

2. Install python and docker.io

   .. include:: install_instructions.rst

3. Setup project

    ..code-block: sh

        # dev
        python3 setup.py dev
        # prod
        python3 setup.py prod

4. Starting Server

    ..code-block: sh

        docker-compose up --build

5. Reseting Server:

    ..code-block: sh

        docker-compose down -v

6. Accessing the application:

    - Dev `http://localhost:8080` <http://localhost:8080>
    - Prod `http://130.61.49.116/` <http://130.61.49.116/>