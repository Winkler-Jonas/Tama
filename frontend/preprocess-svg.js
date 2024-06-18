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
