const path = require('path');

module.exports = {
    mode: {
        symbol: {
            dest: '.',
            sprite: 'src/assets/icons/sprite.svg'
        }
    },
    shape: {
        id: {
            generator: function(name, file) {
                // Extract the file name without extension
                const fileName = path.basename(file, path.extname(file));
                return `icon-${fileName}`;
            }
        }
    }
};