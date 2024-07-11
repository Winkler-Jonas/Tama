#
# This file is part of Project-Tamado.
#
# Copyright (c) 2024 Jonas Winkler
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

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

    def clear_env(self):
        self.__env_dict = dict()

    def add_variable(self, var_name: str, var_value: str, quoted: bool = False):
        # Variable will be overwritten if it already exists
        self.__env_dict[var_name.upper()] = var_value if not quoted else f'\"{var_value}\"'

    def write_to_file(self):
        try:
            self.__env_file.write_text(self.__str__())
            print(f"Created/Wrote file at {self.__env_file}{os.linesep}")
        except:
            print(f"Error: Cannot create file -> {self.__env_file}{os.linesep}"
                  f"Possible solutions: Check user-permissions..{os.linesep}")

    def __str__(self):
        return ''.join([f"{key}={value}{os.linesep}" for key, value in self.__env_dict.items()])
