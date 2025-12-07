# Makeup Store - Billing and Inventory Management

A simple full-stack web application for managing makeup product billing and inventory.

## Features

✅ Display makeup products with name, code, price, and stock
✅ Add items to bill with custom quantity
✅ Automatic total calculation with 10% tax
✅ Real-time stock management
✅ "Out of Stock" indicator
✅ Search products by name or code
✅ Print bill functionality
✅ Reset bill option
✅ **Admin Panel for product management**
✅ **Add/Edit/Delete products dynamically**
✅ Clean and modern UI design

## Project Structure

```
makeup-store/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # Frontend JavaScript
├── admin.html          # Admin panel HTML
├── admin-styles.css    # Admin panel CSS
├── admin-script.js     # Admin panel JavaScript
├── server.js           # Backend API (Node.js + Express)
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## How to Run

### Option 1: Frontend Only (Simple)

1. Just open `index.html` in your web browser
2. No server needed - works standalone!

### Option 2: With Backend (Full-Stack)

1. **Install Node.js** (if not already installed)
   - Download from: https://nodejs.org/

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server**
   ```bash
   npm start
   ```

4. **Open in Browser**
   - Go to: http://localhost:3000

## How to Use

### Main Store (Billing Page)

1. **View Products**: See all available makeup items in the table
2. **Add to Bill**: 
   - Enter quantity
   - Click "Add to Bill" button
3. **View Bill**: Check items added in the Bill Summary section
4. **Remove Item**: Click the trash icon (🗑️) to remove from bill
5. **Print Bill**: Click "Print Bill" to print the receipt
6. **Reset**: Click "Reset" to clear the bill and restore stock
7. **Access Admin**: Click the ⚙️ gear icon in the header

### Admin Panel

1. **Access Admin**: 
   - Click the ⚙️ icon from the main page
   - Or open `admin.html` directly
   
2. **Add New Product**:
   - Fill in the form fields (Name, Code, Price, Stock, Icon)
   - Click "Add Product"
   
3. **Edit Product**:
   - Click "Edit" button on any product card
   - Form will populate with existing data
   - Make changes and click "Update Product"
   
4. **Delete Product**:
   - Click "Delete" button on product card
   - Confirm deletion in the popup
   
5. **Return to Store**: Click "← Back to Store" button

## Products Included

1. **Radiant Glow Face Powder** (FP-001) - Rs. 7,000.00
2. **Matte Velvet Lipstick** (LS-002) - Rs. 5,200.00
3. **Precision Point Eyeliner** (EL-003) - Rs. 4,200.00

## Technologies Used

- **HTML5**: Structure
- **CSS3**: Styling and layout
- **JavaScript**: Frontend logic
- **Node.js + Express**: Backend API (optional)

## API Endpoints (Backend)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Add new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/update-stock` - Update product stock

### Bills
- `POST /api/bills` - Create a new bill
- `GET /api/bills` - Get all bills

### System
- `POST /api/reset` - Reset inventory

## Browser Support

Works on all modern browsers:
- Chrome
- Firefox
- Safari
- Edge

## Notes

- Tax is automatically calculated at 10%
- Stock decreases when items are added to bill
- Stock is restored when items are removed from bill
- The application works offline (frontend only)



