/*
* This file is part of Project-Tamado.
*
* Copyright (c) 2024 Jonas Winkler
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all
* copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
* SOFTWARE.
*/

import fs from 'fs';
import path from 'path';

const srcDir = path.join(process.cwd(), 'src', 'assets', 'icons');
const tempDir = path.join(process.cwd(), 'temp-icons');

// Ensure the temporary directory exists
if (!fs.existsSync(tempDir)){
    fs.mkdirSync(tempDir);
}

// Copy and rename SVG files
fs.readdirSync(srcDir).forEach(file => {
    const extname = path.extname(file);
    const basename = path.basename(file, extname);
    if (extname === '.svg') {
        fs.copyFileSync(path.join(srcDir, file), path.join(tempDir, file));
    }
});
