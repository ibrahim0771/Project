# Quick Setup Guide

## 5-Minute Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Set Up Google Sheets API

**Option A: Using Existing API Key**
- Update `.env` with your Google Sheets API Key:
  ```env
  GOOGLE_SHEETS_API_KEY=your_key_here
  GOOGLE_SHEETS_BUYERS_SHEET_ID=your_buyers_id
  GOOGLE_SHEETS_PRODUCTS_SHEET_ID=your_products_id
  ```

**Option B: Create New API Key (2 minutes)**
1. Go to https://console.cloud.google.com/
2. Create new project
3. Enable "Google Sheets API"
4. Go to Credentials → Create API Key
5. Copy and paste into `.env`

### 4. Create Google Sheets

**Buyers Sheet** template:
```
ID | Company Name | GSTIN | Address | Contact Person | Phone | Email | State Code
1  | ABC Ltd      | 27... | Address | John            | 9999  | john@ | 27
```

**Products Sheet** template:
```
ID | Product Name | HSN Code | Unit | Default Rate | Tax Rate
1  | Product A    | 39232990 | Nos  | 100          | 18
```

### 5. Update Sheet IDs
1. Open your Google Sheet
2. Share it (View access)
3. Copy Sheet ID from URL: `...spreadsheets/d/{SHEET_ID}/edit`
4. Update `.env`:
   ```env
   GOOGLE_SHEETS_BUYERS_SHEET_ID=your_id
   GOOGLE_SHEETS_PRODUCTS_SHEET_ID=your_id
   ```

### 6. Start Server
```bash
npm start
```

Server runs at: `http://localhost:3000`

---

## Key Features Ready to Use

✅ **Dynamic Buyer Selection** - Dropdown fetches from Google Sheets
✅ **Product Selection** - Choose products or enter custom items
✅ **Auto-Calculations** - CGST/SGST/IGST based on state codes
✅ **Professional PDFs** - Company branding, logo, and watermark
✅ **Draft Saving** - Save and continue editing later
✅ **Real-time Preview** - See bill before generating PDF

---

## File Structure

```
Project/
├── config/              # Configuration files
│   ├── company.js       # Company static info (NOT editable in form)
│   ├── googleSheets.js  # Google Sheets setup
│   └── branding.js      # PDF colors and styling
├── src/
│   ├── backend/         # API and business logic
│   │   ├── routes.js
│   │   ├── googleSheetsConnector.js
│   │   ├── taxCalculator.js
│   │   └── pdfGenerator.js
│   └── frontend/
│       └── index.html   # Billing form UI
├── public/js/
│   └── billForm.js      # Frontend logic
├── server.js            # Express server
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/buyers` | List all buyers |
| GET | `/api/products` | List all products |
| POST | `/api/calculate-taxes` | Calculate taxes |
| POST | `/api/generate-pdf` | Generate invoice PDF |
| POST | `/api/preview-bill` | Preview as HTML |
| GET | `/health` | Server health check |

See `API_DOCUMENTATION.md` for detailed docs.

---

## Troubleshooting

### Buyers/Products not loading?
- Check Google Sheets API key in `.env`
- Verify Sheet IDs are correct
- Ensure sheets are shared publicly
- Run: `npm run dev` to see error logs

### PDF not generating?
- Check all required fields are filled
- Verify Puppeteer installed: `npm list puppeteer`
- Check server logs for errors

### Tax calculations wrong?
- Verify buyer state code (default: 27 = Maharashtra)
- Check tax rates in products
- Same state = CGST+SGST, Different state = IGST

---

## Production Deployment

### Before deploying:
1. Update `.env` with production credentials
2. Set `NODE_ENV=production`
3. Test all API endpoints
4. Verify PDF generation works

### Deploy to Heroku:
```bash
npm install -g heroku-cli
heroku create your-app-name
git push heroku main
```

### Deploy to AWS:
1. Use AWS EB or EC2
2. Install Node.js
3. Clone repo
4. Install deps: `npm install`
5. Set env vars
6. Start: `npm start`

---

## Next Steps

1. ✅ Fill `.env` with actual configuration
2. ✅ Create Google Sheets with data
3. ✅ Test with `npm start`
4. ✅ Access `http://localhost:3000` in browser
5. ✅ Select buyer and create first invoice
6. ✅ Generate PDF and download

---

## Support

- See `README.md` for full documentation
- See `API_DOCUMENTATION.md` for API details
- Check browser console for frontend errors
- Check server logs for backend errors

---

**Ready to generate beautiful invoices! 🎉**
