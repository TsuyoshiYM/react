const fs = require('node:fs/promises');
const path = require('path');

const productsFilePath = path.join(__dirname, '..', 'products.json');

// Leer todos los products
async function getStoredProducts() {
  const rawFileContent = await fs.readFile(productsFilePath, { encoding: 'utf-8' });
  const data = JSON.parse(rawFileContent);
  return data.products ?? [];
}

// Escribir un nuevo product
function storeProducts(products) {
  return fs.writeFile(productsFilePath, JSON.stringify({ products: products || [] }));
}

exports.getStoredProducts = getStoredProducts;
exports.storeProducts = storeProducts;