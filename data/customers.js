const fs = require('node:fs/promises');
const path = require('path');

const customersFilePath = path.join(__dirname, '..', 'customers.json');

// Leer todos los customers
async function getStoredCustomers() {
    const rawFileContent = await fs.readFile(customersFilePath, { encoding: 'utf-8' });
    const data = JSON.parse(rawFileContent);
    return data.customers ?? [];
}

// Escribir un nuevo customer
function storeCustomers(customers) {
    return fs.writeFile(customersFilePath, JSON.stringify({ customers: customers || [] }));
}

exports.getStoredCustomers = getStoredCustomers;
exports.storeCustomers = storeCustomers;