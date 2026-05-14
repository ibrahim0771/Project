# Billing System - Advanced Tax Invoice Generator

A professional, dynamic billing system with Google Sheets integration, real-time tax calculations, and beautiful PDF generation with company branding.

## 📋 Features

### Core Functionality
- ✅ **Dynamic Billing Form** - Create bills with real-time updates
- ✅ **Google Sheets Integration** - Fetch buyers and products from Google Sheets
- ✅ **Auto-calculations** - CGST, SGST, IGST calculations based on state codes
- ✅ **Professional PDF** - Beautifully styled invoices with logo and watermark
- ✅ **Draft Management** - Save bills as drafts and edit before finalizing
- ✅ **Company Branding** - Consistent color scheme across all documents

### Separation of Concerns
- **Static Company Information**: Separate from buyer data (not included in dropdown)
- **Dynamic Buyer Selection**: Fetch buyer details from Google Sheets on selection
- **Editable Line Items**: Full control over pricing and calculations
- **Professional Styling**: Company colors, logo, and watermark in PDFs

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Google Cloud Project with Sheets API enabled
- Google Sheet with buyer and product data

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ibrahim0771/Project.git
cd Project
```

2. **Install dependencies**
```bash
npm install
```

3. **Create `.env` file**
```bash
cp .env.example .env
```

4. **Update `.env` with your configuration**
```env
# Google Sheets Configuration
GOOGLE_SHEETS_API_KEY=your_google_api_key_here
GOOGLE_SHEETS_BUYERS_SHEET_ID=your_buyers_sheet_id
GOOGLE_SHEETS_PRODUCTS_SHEET_ID=your_products_sheet_id

# Company Configuration
COMPANY_NAME=Your Company Name
COMPANY_GSTIN=27XXXXXXXXXXXXXZX
COMPANY_MSME_NO=UDYAM-XX-XX-XXXXXXXX
COMPANY_ADDRESS=Your Company Address
COMPANY_PHONE=+91-XXXXXXXXXX
COMPANY_EMAIL=info@yourcompany.com
COMPANY_LOGO_URL=/public/logo.png

# Server Configuration
PORT=3000
NODE_ENV=development

# PDF Styling
PDF_COLOR_PRIMARY=#1e40af
PDF_COLOR_SECONDARY=#3b82f6
PDF_WATERMARK_OPACITY=0.1
```

### Setting Up Google Sheets

#### Step 1: Create Google Sheets
1. Create a new Google Sheet with two worksheets:
   - **Buyers**: Company information
   - **Products**: Product/Material information

#### Step 2: Structure Your Sheets

**Buyers Sheet** (Header Row):
```
| ID | Company Name | GSTIN | Address | Contact Person | Phone | Email | State Code |
|----|--------------|-------|---------|------------------|-------|-------|------------|
| 1  | ABC Ltd      | 27... | Address | John Doe       | 9999  | ...   | 27        |
```

**Products Sheet** (Header Row):
```
| ID | Product Name | HSN Code | Unit | Default Rate | Tax Rate |
|----|--------------|----------|------|--------------|----------|
| 1  | PP Woven Bag | 39232990 | Nos  | 33.60        | 18      |
```

#### Step 3: Get Google API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **Google Sheets API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Copy the API key to your `.env` file

#### Step 4: Share Your Sheet
1. Open your Google Sheet
2. Click **Share** button
3. Change to **"Anyone with the link"** (View only)
4. Extract Sheet ID from URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
5. Update `.env` with your Sheet IDs

### Running the Application

**Development Mode**:
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
Project/
├── config/
│   ├── company.js           # Static company configuration
│   ├── googleSheets.js      # Google Sheets integration setup
│   └── branding.js          # PDF branding and styling
├── src/
│   ├── backend/
│   │   ├── googleSheetsConnector.js  # Google Sheets data fetching
│   │   ├── taxCalculator.js          # Tax calculation engine
│   │   ├── pdfGenerator.js           # PDF generation
│   │   └── routes.js                 # API routes
│   └── frontend/
│       └── index.html                # Billing form UI
├── public/
│   ├── js/
│   │   └── billForm.js      # Frontend form logic
│   └── logo.png             # Company logo
├── server.js                 # Express server entry point
├── package.json
├── .env.example
└── README.md
```

## 🔌 API Endpoints

### GET `/api/buyers`
Fetch all buyers from Google Sheets.

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "companyName": "ABC Ltd",
      "gstin": "27...",
      "address": "...",
      "stateCode": "27"
    }
  ]
}
```

### GET `/api/buyers/:id`
Fetch a specific buyer by ID.

### GET `/api/products`
Fetch all products from Google Sheets.

### GET `/api/products/:id`
Fetch a specific product by ID.

### POST `/api/calculate-taxes`
Calculate taxes and totals for line items.

**Request Body**:
```json
{
  "lineItems": [
    {
      "quantity": 100,
      "rate": 33.60,
      "taxRate": 18
    }
  ],
  "sellerStateCode": "27",
  "buyerStateCode": "27",
  "roundOff": 0
}
```

### POST `/api/generate-pdf`
Generate a PDF bill.

**Request Body**:
```json
{
  "billData": {
    "documentNumber": "MOPL/25/26-27",
    "documentDate": "2026-04-15",
    "buyer": { /* buyer object */ },
    "lineItems": [ /* line items */ ],
    "totals": { /* calculated totals */ }
  }
}
```

### POST `/api/preview-bill`
Generate HTML preview of the bill.

## 🎨 Branding & Styling

### Colors
The system uses a professional color scheme defined in `config/branding.js`:
- **Primary**: #1e40af (Deep Blue)
- **Secondary**: #3b82f6 (Light Blue)
- **Accent**: #f59e0b (Amber)
- **Text**: #1f2937 (Dark Gray)

### Logo & Watermark
- Logo appears in top-left corner of PDF (80x80px)
- Watermark text: "CONFIDENTIAL" (customizable)
- Watermark opacity: 0.1 (adjustable)

### PDF Features
- A4 page size with 15mm margins
- Professional header with company info
- Company logo and watermark
- Buyer details automatically populated
- Line items table with auto-calculations
- Tax summary with CGST/SGST/IGST
- Grand total in highlighted section
- Footer with company contact

## 💡 Key Features Explained

### 1. Static Company Information
- Stored in `config/company.js`
- Not editable in billing form
- Appears automatically on all PDFs
- Separate from buyer information

### 2. Dynamic Buyer Selection
- Dropdown fetches data from Google Sheets
- On selection, auto-populates buyer details
- State code determines CGST/SGST vs IGST
- Can be changed before finalizing bill

### 3. Product Selection
- Dropdown with products from Google Sheets
- Auto-fills description, HSN, unit, rate, tax rate
- Or enter custom items manually
- Fully editable before generating PDF

### 4. Real-Time Calculations
- Instant tax calculation on any change
- Supports CGST+SGST (same state) or IGST (different state)
- Auto-updates line item totals
- Recalculates based on buyer's state code

### 5. PDF Generation
- Beautiful, professional layout
- Company branding and colors
- Logo and watermark integration
- Responsive to all screen sizes
- Print-ready formatting

## 🔒 Security Considerations

1. **API Key Protection**: Store Google Sheets API key in `.env` only
2. **Read-Only Access**: Google Sheets accessed as read-only via API
3. **CORS**: Configure CORS based on your deployment domain
4. **Validation**: All inputs validated before processing
5. **No Database**: Uses Google Sheets as data source

## 🛠️ Customization

### Change Company Branding
Edit `config/branding.js`:
```javascript
colors: {
  primary: '#your-color',
  secondary: '#your-color',
  // ... other colors
}
```

### Update Company Information
Edit `config/company.js` or update `.env` file:
```env
COMPANY_NAME=New Company Name
COMPANY_GSTIN=New GSTIN
```

### Modify PDF Layout
Edit `PDFGenerator.generateBillHTML()` in `src/backend/pdfGenerator.js`

## 📝 Usage Examples

### Creating a Bill
1. Fill in Document Number and Date
2. Select a Buyer from dropdown
3. Add Line Items (select products or enter custom)
4. Edit quantities, rates, and tax rates as needed
5. Review calculations in Summary section
6. Click "Generate PDF" to download

### Saving as Draft
1. Fill in bill information
2. Click "Save as Draft" button
3. Bill stored in browser's localStorage
4. Return to form to continue editing

### Previewing Bill
1. Fill in required fields and add line items
2. Click "Preview" button
3. Modal opens showing how PDF will look
4. Make adjustments if needed
5. Generate PDF or save as draft

## 🐛 Troubleshooting

### Google Sheets not loading
- Verify API key is correct in `.env`
- Ensure Google Sheets API is enabled
- Check Sheet IDs are correct
- Verify sheets are shared publicly

### PDF not generating
- Check server logs for errors
- Ensure Puppeteer is installed
- Verify all required data is filled in
- Check available disk space

### Tax calculations incorrect
- Verify buyer's state code
- Check line item tax rates
- Ensure quantities and rates are numbers
- Review calculation logs in console

## 📧 Support & Contribution

For issues, feature requests, or contributions, please open an issue on GitHub.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔄 Future Enhancements

- Multi-company support
- Document versioning and history
- Email delivery of invoices
- Supabase database integration
- QR codes on invoices
- Multiple document types (Quotations, Challan, etc.)
- Admin branding customization UI
- Payment tracking and receipts

---

**Built with ❤️ for seamless billing operations**
