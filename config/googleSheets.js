/**
 * Google Sheets Configuration and Integration Setup
 * This file contains placeholders for Google Sheets connection
 * Replace the SHEET_IDs with your actual Google Sheet IDs after setting up the sheets
 */

export const googleSheetsConfig = {
  // Google API Configuration
  apiKey: process.env.GOOGLE_SHEETS_API_KEY,
  
  // Sheet IDs - IMPORTANT: Replace these with your actual Google Sheet IDs
  sheets: {
    // Buyers/Customers sheet containing all buyer information
    // Columns expected: Company Name, GSTIN, Address, Contact Person, Phone, Email, State Code
    buyers: {
      sheetId: process.env.GOOGLE_SHEETS_BUYERS_SHEET_ID || 'REPLACE_WITH_BUYERS_SHEET_ID',
      range: 'Buyers!A:G',
      headers: ['id', 'companyName', 'gstin', 'address', 'contactPerson', 'phone', 'email', 'stateCode'],
    },
    
    // Products/Materials sheet containing all products information
    // Columns expected: Product Name, HSN Code, Unit, Default Rate, Tax Rate, Stock (optional)
    products: {
      sheetId: process.env.GOOGLE_SHEETS_PRODUCTS_SHEET_ID || 'REPLACE_WITH_PRODUCTS_SHEET_ID',
      range: 'Products!A:F',
      headers: ['id', 'productName', 'hsn', 'unit', 'defaultRate', 'taxRate'],
    },
  },
  
  // Connection settings
  batchSize: 100, // Number of rows to fetch in one request
  cacheExpiry: 3600, // Cache expiry in seconds (1 hour)
  retryAttempts: 3,
  retryDelay: 1000, // in milliseconds
};

/**
 * Instructions for setting up Google Sheets:
 * 
 * 1. Create a Google Sheet with two worksheets:
 *    - Sheet 1: Named "Buyers" with buyer information
 *    - Sheet 2: Named "Products" with product/material information
 * 
 * 2. Get your Google Sheets API Key:
 *    - Go to Google Cloud Console
 *    - Create a new project
 *    - Enable Google Sheets API
 *    - Create an API key from Credentials
 *    - Update GOOGLE_SHEETS_API_KEY in .env
 * 
 * 3. Share your Google Sheets publicly (view-only):
 *    - Open the sheet
 *    - Click Share > Change to "Anyone with the link"
 *    - Extract the Sheet ID from the URL: 
 *      https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit
 * 
 * 4. Update the .env file with:
 *    GOOGLE_SHEETS_API_KEY=your_api_key
 *    GOOGLE_SHEETS_BUYERS_SHEET_ID=your_buyers_sheet_id
 *    GOOGLE_SHEETS_PRODUCTS_SHEET_ID=your_products_sheet_id
 */

export default googleSheetsConfig;
