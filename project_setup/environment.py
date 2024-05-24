import os
from pathlib import Path
from typing import Dict, List


class Environment:

    def __init__(self, env_file: Path):
        self.__env_file: Path = env_file.resolve()
        self.__env_dict: Dict = dict()
        self.__read_env()

    def __read_env(self):
        if self.__env_file.exists() and self.__env_file.is_file():
            lines: List[str] = self.__env_file.read_text().splitlines()
            self.__env_dict |= {key: value for line in lines for key, value in [line.split('=', 1)]}

    def add_variable(self, var_name: str, var_value: str):
        # Key will be overwritten if it already exists
        self.__env_dict[var_name.upper()] = var_value

    def write_to_file(self):
        try:
            self.__env_file.write_text(self.__str__())
            print(f"Created/Wrote file at {self.__env_file.resolve()}{os.linesep}")
        except:
            print(f"Error: Cannot create file -> {self.__env_file}{os.linesep}"
                  f"Possible solutions: Check user-permissions..{os.linesep}")

    def __str__(self):
        return ''.join([f"{key}={value}{os.linesep}" for key, value in self.__env_dict.items()])


if __name__ == '__main__':
    env_file_path: Path = Path('../env')
    python_env: Environment = Environment(env_file_path)
    python_env.add_variable('xy', 'oma')
    python_env.add_variable('new_key', 'new_val')
    python_env.write_to_file()