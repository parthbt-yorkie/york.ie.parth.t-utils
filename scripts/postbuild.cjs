const fs = require('fs');
const path = require('path');

const distPath = path.resolve(__dirname, '../dist');

const esmOld = path.join(distPath, 'index.js');
const esmNew = path.join(distPath, 'index.esm.js');

if (fs.existsSync(esmOld)) {
    fs.renameSync(esmOld, esmNew);
    console.log(`Renamed ${esmOld} -> ${esmNew}`);
} else {
    console.warn(`File not found: ${esmOld}`);
}
