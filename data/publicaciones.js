const fs = require('node:fs/promises');

// Leer todas las publicaciones
async function getStoredPublicaciones() {
    const rawFileContent = await fs.readFile('publicaciones.json', { encoding: 'utf-8' });
    const data = JSON.parse(rawFileContent);
    return data.publicaciones ?? [];
}

// Escribir publicaciones
function storePublicaciones(publicaciones) {
    return fs.writeFile('publicaciones.json', JSON.stringify({ publicaciones: publicaciones || [] }));
}

exports.getStoredPublicaciones = getStoredPublicaciones;
exports.storePublicaciones = storePublicaciones;