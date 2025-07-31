const fs = require('fs').promises;
const path = require('path');

const ordersFilePath = path.join(__dirname, '..', 'orders.json');

async function getStoredOrders() {
  try {
    const rawData = await fs.readFile(ordersFilePath, { encoding: 'utf8' });
    return JSON.parse(rawData);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // Si el archivo no existe, devolvemos un array vacío
      return [];
    }
    throw error;
  }
}

async function storeOrders(orders) {
  return fs.writeFile(ordersFilePath, JSON.stringify(orders));
}

exports.getStoredOrders = getStoredOrders;
exports.storeOrders = storeOrders; 