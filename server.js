// Simple Express Backend for Makeup Store with JSON file persistence

// Import required packages
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// File paths for persistence
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

// Create Express app
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json({ limit: '5mb' })); // Parse JSON data with image base64 support
app.use(express.static(path.join(__dirname))); // Serve static files from project root

// ---------- Persistence Helpers ----------
const defaultStore = {
    products: [
        {
            id: 1,
            name: "Radiant Glow Face Powder",
            code: "FP-001",
            price: 7000.0,
            stock: 50,
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ffeaa7' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-size='40' text-anchor='middle' dy='.3em'%3E✨%3C/text%3E%3C/svg%3E"
        },
        {
            id: 2,
            name: "Matte Velvet Lipstick",
            code: "LS-002",
            price: 5200.0,
            stock: 120,
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23ff7675' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-size='40' text-anchor='middle' dy='.3em'%3E💄%3C/text%3E%3C/svg%3E"
        },
        {
            id: 3,
            name: "Precision Point Eyeliner",
            code: "EL-003",
            price: 4200.0,
            stock: 0,
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23a29bfe' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' font-size='40' text-anchor='middle' dy='.3em'%3E✏️%3C/text%3E%3C/svg%3E"
        }
    ],
    bills: [],
    billCounter: 1
};

function ensureDataFile() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(defaultStore, null, 2), 'utf8');
        return JSON.parse(JSON.stringify(defaultStore));
    }

    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(raw);
    } catch (error) {
        console.error('Failed to read data file, using defaults:', error);
        return JSON.parse(JSON.stringify(defaultStore));
    }
}

function saveStore() {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
}

// Load store at startup
let store = ensureDataFile();

// ============ API ROUTES ============

// GET - Get all products
app.get('/api/products', (req, res) => {
    res.json({
        success: true,
        data: store.products
    });
});

// GET - Get single product by ID
app.get('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const product = store.products.find(p => p.id === productId);
    
    if (product) {
        res.json({
            success: true,
            data: product
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
});

// POST - Update product stock
app.post('/api/products/update-stock', (req, res) => {
    const { productId, quantity } = req.body;
    
    const product = store.products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    
    // Update stock
    product.stock = quantity;
    saveStore();
    
    res.json({
        success: true,
        message: 'Stock updated successfully',
        data: product
    });
});

// POST - Create a new bill
app.post('/api/bills', (req, res) => {
    const { items } = req.body;
    
    // Validate items
    if (!items || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: 'No items in bill'
        });
    }
    
    // Calculate totals
    let subtotal = 0;
    const processedItems = [];
    
    for (let item of items) {
        const product = store.products.find(p => p.id === item.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: `Product with ID ${item.id} not found`
            });
        }
        
        if (product.stock < item.quantity) {
            return res.status(400).json({
                success: false,
                message: `Not enough stock for ${product.name}`
            });
        }
        
        // Reduce stock
        product.stock -= item.quantity;
        
        // Calculate item total
        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;
        
        processedItems.push({
            productId: product.id,
            name: product.name,
            code: product.code,
            price: product.price,
            quantity: item.quantity,
            total: itemTotal
        });
    }
    
    // Calculate tax and total
    const tax = subtotal * 0.10; // 10% tax
    const total = subtotal + tax;
    
    // Create bill
    const bill = {
        id: store.billCounter++,
        items: processedItems,
        subtotal: subtotal,
        tax: tax,
        total: total,
        date: new Date().toISOString()
    };
    
    store.bills.push(bill);
    saveStore();
    
    res.json({
        success: true,
        message: 'Bill created successfully',
        data: bill
    });
});

// GET - Get all bills
app.get('/api/bills', (req, res) => {
    res.json({
        success: true,
        data: store.bills
    });
});

// GET - Get single bill by ID
app.get('/api/bills/:id', (req, res) => {
    const billId = parseInt(req.params.id);
    const bill = store.bills.find(b => b.id === billId);
    
    if (bill) {
        res.json({
            success: true,
            data: bill
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Bill not found'
        });
    }
});

// POST - Add new product
app.post('/api/products', (req, res) => {
    const { name, code, price, stock, image } = req.body;
    
    // Validate input
    if (!name || !code || price === undefined || stock === undefined) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields'
        });
    }
    
    // Generate new ID
    const newId = store.products.length > 0 ? Math.max(...store.products.map(p => p.id)) + 1 : 1;
    
    // Create new product
    const newProduct = {
        id: newId,
        name: name,
        code: code,
        price: parseFloat(price),
        stock: parseInt(stock),
        image: image || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Crect fill=\'%23dfe6e9\' width=\'100\' height=\'100\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' font-size=\'40\' text-anchor=\'middle\' dy=\'.3em\'%3E📦%3C/text%3E%3C/svg%3E'
    };
    
    store.products.push(newProduct);
    saveStore();
    
    res.json({
        success: true,
        message: 'Product added successfully',
        data: newProduct
    });
});

// PUT - Update existing product
app.put('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const { name, code, price, stock, image } = req.body;
    
    const product = store.products.find(p => p.id === productId);
    
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    
    // Update product fields
    if (name !== undefined) product.name = name;
    if (code !== undefined) product.code = code;
    if (price !== undefined) product.price = parseFloat(price);
    if (stock !== undefined) product.stock = parseInt(stock);
    if (image !== undefined) product.image = image;
    
    saveStore();

    res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
    });
});

// DELETE - Delete product
app.delete('/api/products/:id', (req, res) => {
    const productId = parseInt(req.params.id);
    const productIndex = store.products.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    
    const deletedProduct = store.products.splice(productIndex, 1)[0];
    saveStore();
    
    res.json({
        success: true,
        message: 'Product deleted successfully',
        data: deletedProduct
    });
});

// POST - Reset inventory (for testing)
app.post('/api/reset', (req, res) => {
    store = JSON.parse(JSON.stringify(defaultStore));
    saveStore();
    
    res.json({
        success: true,
        message: 'Inventory reset successfully'
    });
});

// Root route
app.get('/', (req, res) => {
    res.send(`
        <h1>Makeup Store API</h1>
        <p>Welcome to the Makeup Store Backend API</p>
        <h2>Available Endpoints:</h2>
        <ul>
            <li>GET /api/products - Get all products</li>
            <li>GET /api/products/:id - Get single product</li>
            <li>POST /api/products - Add new product</li>
            <li>PUT /api/products/:id - Update product</li>
            <li>DELETE /api/products/:id - Delete product</li>
            <li>POST /api/products/update-stock - Update product stock</li>
            <li>POST /api/bills - Create a new bill</li>
            <li>GET /api/bills - Get all bills</li>
            <li>GET /api/bills/:id - Get single bill</li>
            <li>POST /api/reset - Reset inventory</li>
        </ul>
    `);
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);
});
