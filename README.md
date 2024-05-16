# Tama

## Setting Up the Development Environment

1. Clone the repository:
    ```sh
    git clone https://github.com/your/repo.git
    cd repo
    ```

2. Create the virtual environment and install dependencies:
    ```sh
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3. Generate the `.env` file:
    ```sh
    python generate_env.py
    ```

4. Run Docker Compose to start the services:
    ```sh
    docker-compose up --build
    ```

5. Access the application:
    - **Django backend**: http://localhost:8000
    - **Vue frontend**: http://localhost:8080

