const express = require('express');
const bodyParser = require('body-parser');
const md5 = require('blueimp-md5');

// Importar módulos de datos
const { getStoredProducts, storeProducts } = require('./data/products');
const { getStoredCustomers, storeCustomers } = require('./data/customers');
const { getStoredPublicaciones, storePublicaciones } = require('./data/publicaciones');
const { getStoredOrders, storeOrders } = require('./data/orders');

const app = express();

app.use(bodyParser.json());

// Configuración de CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://sprightly-tiramisu-62a3eb.netlify.app/');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});

// Rutas para PRODUCTS
app.get('/products', async (req, res) => {
  const storedProducts = await getStoredProducts();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ products: storedProducts });
  res.status(200);
});

app.get('/products/:id', async (req, res) => {
  const storedProducts = await getStoredProducts();
  const product = storedProducts.find((product) => product.id === req.params.id);
  res.json({ product });
});

app.post('/products', async (req, res) => {
  const existingProducts = await getStoredProducts();
  const productData = req.body;
  const newProduct = {
    id: md5(req.body.description+Date.now()),
    ...productData
  };
  const updatedProducts = [newProduct, ...existingProducts];
  await storeProducts(updatedProducts);
  res.status(201).json({ message: 'Stored new product.', product: newProduct });
});

app.put('/products/:id', async (req, res) => {
  try {
    const productsData = await getStoredProducts();
    const productIndex = productsData.findIndex(item => item.id === req.params.id);

    const product = productsData.find(item => item.id === req.params.id);
    if (!product) return res.status(404).send('This product was not found.');

    product.title        = req.body.title;
    product.description  = req.body.description;
    product.category     = req.body.category;
    product.price        = req.body.price;
    product.discount     = req.body.discount;
    product.rating       = req.body.rating;
    product.stock        = req.body.stock;
    product.brand        = req.body.brand;
    product.weight       = req.body.weight;

    productsData[productIndex] = product;

    await storeProducts(productsData);
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el producto', error: error.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  const productsData = await getStoredProducts();
  const products = productsData
      .filter(item => item.id !== req.params.id);
  await storeProducts(products);
  res.status(204).send();
});

// Rutas para CUSTOMERS
app.get('/customers', async (req, res) => {
  const storedCustomers = await getStoredCustomers();
  // await new Promise((resolve, reject) => setTimeout(() => resolve(), 1500));
  res.json({ customers: storedCustomers });
  res.status(200);
});

app.get('/customers/:id', async (req, res) => {
  const storedCustomers = await getStoredCustomers();
  const customer = storedCustomers.find((customer) => customer.id === req.params.id);
  res.json({ customer });
});

app.post('/customers', async (req, res) => {
  const existingCustomers = await getStoredCustomers();
  const customerData = req.body;
  const newCustomer = {
    id: md5(req.body.email+Date.now()),
    ...customerData
  };
  const updatedCustomers = [newCustomer, ...existingCustomers];
  await storeCustomers(updatedCustomers);
  res.status(201).json({ message: 'Stored new customer.', customer: newCustomer });
});

app.put('/customers/:id', async (req, res) => {
  const customerData = await getStoredCustomers();
  const customerIndex = customerData.findIndex(item => item.id === req.params.id);

  const customer =
      customerData.find(
          item => item.id === req.params.id
      );
  if (!customer) return res.status(404).send('This customer was not found.');

  customer.name     = req.body.name;
  customer.dni      = req.body.dni;
  customer.phone    = req.body.phone;
  customer.email    = req.body.email;
  customer.address  = req.body.address;

  customerData[customerIndex] = customer;

  await storeCustomers(customerData);
  res.json(customer);
});

app.delete('/customers/:id', async (req, res) => {
  const customerData = await getStoredCustomers();
  const customers = customerData
      .filter(item => item.id !== req.params.id);
  await storeCustomers(customers);
  res.status(204).send();
});

// RUTAS PARA PUBLICACIONES
app.get('/publicaciones', async (req, res) => {
  const publicaciones = await getStoredPublicaciones();
  res.json({ publicaciones: publicaciones });
});

app.get('/publicaciones/:id', async (req, res) => {
  const publicaciones = await getStoredPublicaciones();
  const publicacion = publicaciones.find(pub => pub.id === req.params.id);
  
  if (!publicacion) {
    return res.status(404).json({ message: 'Publicación no encontrada' });
  }
  
  res.json({ publicacion: publicacion });
});

app.post('/publicaciones', async (req, res) => {
  const existingPublicaciones = await getStoredPublicaciones();
  const publicacionData = req.body;
  
  const newPublicacion = {
    ...publicacionData,
    id: md5(new Date().toISOString() + Math.random().toString())
  };
  
  const updatedPublicaciones = [newPublicacion, ...existingPublicaciones];
  await storePublicaciones(updatedPublicaciones);
  
  res.status(201).json({ message: 'Publicación creada', publicacion: newPublicacion });
});

app.patch('/publicaciones/:id', async (req, res) => {
  const publicaciones = await getStoredPublicaciones();
  const publicacionIndex = publicaciones.findIndex(pub => pub.id === req.params.id);
  
  if (publicacionIndex < 0) {
    return res.status(404).json({ message: 'Publicación no encontrada' });
  }
  
  const existingPublicacion = publicaciones[publicacionIndex];
  const updatedPublicacion = { ...existingPublicacion, ...req.body };
  publicaciones[publicacionIndex] = updatedPublicacion;
  
  await storePublicaciones(publicaciones);
  
  res.json({ message: 'Publicación actualizada', publicacion: updatedPublicacion });
});

// Modificar la ruta DELETE para implementar soft delete
app.delete('/publicaciones/:id', async (req, res) => {
  const publicaciones = await getStoredPublicaciones();
  const publicacionIndex = publicaciones.findIndex(pub => pub.id === req.params.id);
  
  if (publicacionIndex < 0) {
    return res.status(404).json({ message: 'Publicación no encontrada' });
  }
  
  // En lugar de eliminar, marcar como eliminado
  publicaciones[publicacionIndex].eliminado = true;
  await storePublicaciones(publicaciones);
  
  res.json({ message: 'Publicación marcada como eliminada' });
});

// RUTAS PARA ÓRDENES/VENTAS
app.get('/orders', async (req, res) => {
  const orders = await getStoredOrders();
  res.json({ orders });
});

app.get('/orders/:id', async (req, res) => {
  const orders = await getStoredOrders();
  const order = orders.find(order => order.orderNumber === req.params.id);
  
  if (!order) {
    return res.status(404).json({ message: 'Orden no encontrada' });
  }
  
  res.json({ order });
});

app.post('/orders', async (req, res) => {
  try {
    const existingOrders = await getStoredOrders();
    const orderData = req.body;
    
    // Verificar y registrar/actualizar cliente
    const customerInfo = orderData.customer;
    let customerId = null;
    let customerData = null;
    
    if (customerInfo && customerInfo.email) {
      const existingCustomers = await getStoredCustomers();
      
      // Buscar cliente por email
      const existingCustomer = existingCustomers.find(
        customer => customer.email && customer.email.toLowerCase() === customerInfo.email.toLowerCase()
      );
      
      if (existingCustomer) {
        // Actualizar datos del cliente existente
        customerId = existingCustomer.id;
        
        // Actualizar cliente si hay nuevos datos
        const needsUpdate = 
          (customerInfo.nombre && customerInfo.nombre !== existingCustomer.name) ||
          (customerInfo.telefono && customerInfo.telefono !== existingCustomer.phone) ||
          (customerInfo.direccion && customerInfo.direccion !== existingCustomer.address) ||
          (customerInfo.dni && customerInfo.dni !== existingCustomer.dni);
        
        if (needsUpdate) {
          const customerIndex = existingCustomers.findIndex(c => c.id === customerId);
          existingCustomers[customerIndex] = {
            ...existingCustomer,
            name: customerInfo.nombre || existingCustomer.name,
            phone: customerInfo.telefono || existingCustomer.phone,
            address: customerInfo.direccion || existingCustomer.address,
            dni: customerInfo.dni || existingCustomer.dni
          };
          
          await storeCustomers(existingCustomers);
          customerData = existingCustomers[customerIndex];
        } else {
          customerData = existingCustomer;
        }
      } else {
        // Crear nuevo cliente
        const newCustomer = {
          id: md5(customerInfo.email + Date.now()),
          name: customerInfo.nombre + ' ' + customerInfo.apellidos,
          phone: customerInfo.telefono,
          email: customerInfo.email,
          address: customerInfo.direccion,
          dni: customerInfo.dni
        };
        
        const updatedCustomers = [newCustomer, ...existingCustomers];
        await storeCustomers(updatedCustomers);
        
        customerId = newCustomer.id;
        customerData = newCustomer;
      }
    }
    
    // Actualizar inventario - reducir stock de productos
    const productsData = await getStoredProducts();
    
    // Para cada producto en la orden
    for (const item of orderData.products) {
      const productIndex = productsData.findIndex(p => p.id === item.id);
      if (productIndex >= 0) {
        // Restar la cantidad del stock
        productsData[productIndex].stock = Math.max(
          0, 
          parseInt(productsData[productIndex].stock) - item.quantity
        );
      }
    }
    
    // Guardar productos actualizados
    await storeProducts(productsData);
    
    // Añadir ID y datos completos del cliente a la orden
    if (customerId) {
      orderData.customerId = customerId;
      // Asegurar que los datos del cliente estén actualizados en la orden
      orderData.customer = {
        ...orderData.customer,
        id: customerId,
        // Asegurar que tenemos todos los datos disponibles
        nombre: customerData.name.split(' ')[0] || orderData.customer.nombre,
        apellidos: customerData.name.split(' ').slice(1).join(' ') || orderData.customer.apellidos,
        dni: customerData.dni || orderData.customer.dni,
        direccion: customerData.address || orderData.customer.direccion,
        telefono: customerData.phone || orderData.customer.telefono,
        email: customerData.email || orderData.customer.email,
      };
    }
    
    // Añadir fecha de creación y estado
    orderData.createdAt = new Date().toISOString();
    if (!orderData.status) {
      orderData.status = 'Pendiente';
    }
    
    // Guardar la orden
    const updatedOrders = [orderData, ...existingOrders];
    await storeOrders(updatedOrders);
    
    res.status(201).json({ 
      message: 'Orden creada', 
      order: orderData,
      customerId: customerId,
      updatedProducts: orderData.products.map(item => {
        const product = productsData.find(p => p.id === item.id);
        return {
          id: item.id,
          newStock: product ? product.stock : 'not found'
        };
      })
    });
  } catch (error) {
    console.error('Error al procesar la orden:', error);
    res.status(500).json({ 
      message: 'Error al procesar la orden', 
      error: error.message 
    });
  }
});

app.listen(8080, () => {
  console.log('Servidor corriendo en puerto 8080');
});
