# API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
Currently, the API uses no authentication. Google Sheets API uses an API key stored in environment variables for security.

---

## Endpoints

### 1. Fetch All Buyers

**Endpoint**: `GET /api/buyers`

**Description**: Fetch all buyers/companies from Google Sheets

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "companyName": "SARV POLYPACK INDIA PRIVATE LIMITED",
      "gstin": "27ABLCS3117R1ZO",
      "address": "Shop No.8, C-9, Shantideep Society",
      "contactPerson": "John Doe",
      "phone": "+91-9999999999",
      "email": "john@example.com",
      "stateCode": "27"
    }
  ],
  "count": 1
}
```

**Example**:
```bash
curl http://localhost:3000/api/buyers
```

---

### 2. Fetch Specific Buyer

**Endpoint**: `GET /api/buyers/:id`

**Description**: Fetch a specific buyer by ID

**Parameters**:
- `id` (integer, required): Buyer ID

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "companyName": "SARV POLYPACK INDIA PRIVATE LIMITED",
    "gstin": "27ABLCS3117R1ZO",
    "address": "Shop No.8, C-9, Shantideep Society",
    "stateCode": "27"
  }
}
```

**Example**:
```bash
curl http://localhost:3000/api/buyers/1
```

---

### 3. Fetch All Products

**Endpoint**: `GET /api/products`

**Description**: Fetch all products/materials from Google Sheets

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "productName": "PP Woven Sack Bags",
      "hsn": "39232990",
      "unit": "Nos",
      "defaultRate": 33.60,
      "taxRate": 18
    }
  ],
  "count": 1
}
```

**Example**:
```bash
curl http://localhost:3000/api/products
```

---

### 4. Fetch Specific Product

**Endpoint**: `GET /api/products/:id`

**Description**: Fetch a specific product by ID

**Parameters**:
- `id` (integer, required): Product ID

**Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "productName": "PP Woven Sack Bags",
    "hsn": "39232990",
    "unit": "Nos",
    "defaultRate": 33.60,
    "taxRate": 18
  }
}
```

**Example**:
```bash
curl http://localhost:3000/api/products/1
```

---

### 5. Calculate Taxes

**Endpoint**: `POST /api/calculate-taxes`

**Description**: Calculate CGST, SGST, IGST, and totals for given line items

**Request Body**:
```json
{
  "lineItems": [
    {
      "quantity": 8892,
      "rate": 33.60,
      "taxRate": 18
    }
  ],
  "sellerStateCode": "27",
  "buyerStateCode": "27",
  "roundOff": -0.02
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "lineItems": [
      {
        "quantity": 8892,
        "rate": 33.60,
        "taxableAmount": 298771.20,
        "cgst": 13444.7,
        "sgst": 13444.7,
        "igst": 0,
        "totalTax": 26889.4,
        "totalAmount": 325660.6,
        "taxType": "CGST+SGST",
        "taxRate": 18
      }
    ],
    "totals": {
      "taxableValue": "298771.20",
      "cgst": "13444.70",
      "sgst": "13444.70",
      "igst": "0.00",
      "totalTax": "26889.40",
      "roundOff": "-0.02",
      "grandTotal": "325660.58"
    }
  }
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/calculate-taxes \
  -H "Content-Type: application/json" \
  -d '{
    "lineItems": [{"quantity": 100, "rate": 50, "taxRate": 18}],
    "sellerStateCode": "27",
    "buyerStateCode": "27"
  }'
```

**Notes**:
- For same state transactions (sellerStateCode === buyerStateCode): Uses CGST + SGST
- For inter-state transactions: Uses IGST
- All amounts are returned as strings for precision

---

### 6. Generate PDF

**Endpoint**: `POST /api/generate-pdf`

**Description**: Generate a professional PDF bill

**Request Body**:
```json
{
  "billData": {
    "documentNumber": "MOPL/25/26-27",
    "documentDate": "2026-04-15",
    "dueDate": "2026-05-15",
    "buyer": {
      "companyName": "SARV POLYPACK INDIA PRIVATE LIMITED",
      "gstin": "27ABLCS3117R1ZO",
      "address": "Shop No.8, C-9, Shantideep Society",
      "stateCode": "27"
    },
    "lineItems": [
      {
        "description": "PP Woven Sack Bags",
        "hsnCode": "39232990",
        "quantity": 8892,
        "unit": "Nos",
        "rate": 33.60,
        "taxableAmount": 298771.20,
        "totalTax": 26889.40,
        "totalAmount": 325660.60,
        "taxRate": 18
      }
    ],
    "totals": {
      "taxableValue": "298771.20",
      "cgst": "13444.70",
      "sgst": "13444.70",
      "igst": "0.00",
      "roundOff": "-0.02",
      "grandTotal": "325660.58"
    }
  }
}
```

**Response**:
Binary PDF file

**Headers**:
- `Content-Type`: application/pdf
- `Content-Disposition`: attachment; filename="MOPL/25/26-27.pdf"

**Example**:
```bash
curl -X POST http://localhost:3000/api/generate-pdf \
  -H "Content-Type: application/json" \
  -d @bill-data.json \
  --output invoice.pdf
```

---

### 7. Preview Bill (HTML)

**Endpoint**: `POST /api/preview-bill`

**Description**: Generate HTML preview of the bill

**Request Body**:
Same as `/api/generate-pdf`

**Response**:
```json
{
  "success": true,
  "data": {
    "html": "<!DOCTYPE html>...</html>"
  }
}
```

---

### 8. Refresh Cache

**Endpoint**: `POST /api/refresh-cache`

**Description**: Clear cached data from Google Sheets and reload fresh data

**Response**:
```json
{
  "success": true,
  "message": "Cache cleared successfully"
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/api/refresh-cache
```

---

### 9. Health Check

**Endpoint**: `GET /health`

**Description**: Check server health status

**Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-05-14T17:24:55.455Z"
}
```

**Example**:
```bash
curl http://localhost:3000/health
```

---

## Error Responses

All endpoints return error responses in the following format:

```json
{
  "success": false,
  "error": "Error title",
  "message": "Detailed error message"
}
```

**Common HTTP Status Codes**:
- `200 OK`: Successful request
- `400 Bad Request`: Invalid input or missing required fields
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

**Example Error**:
```json
{
  "success": false,
  "error": "Buyer not found",
  "message": "No buyer exists with ID 999"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider implementing:
- Request rate limiting
- API key authentication
- Request validation

---

## Data Types

### StateCode
Maharashtra state codes for CGST/SGST vs IGST determination:
- Same state = CGST + SGST (9% + 9% = 18%)
- Different state = IGST (18%)

### TaxRate
GST tax rate as a percentage (typically 18%, but can vary by product)

### Amount
All monetary amounts should be passed as numbers (not strings) in requests, but are returned as strings in responses for precision.

---

## Best Practices

1. **Batch Requests**: Use `/api/buyers` and `/api/products` once on page load, not repeatedly
2. **Error Handling**: Always check `success` field before accessing `data`
3. **Caching**: Google Sheets data is cached for 1 hour by default
4. **Validation**: Validate all inputs before sending to API
5. **State Codes**: Always provide correct state codes for accurate tax calculation

---

## Example Workflow

### Creating an Invoice

```javascript
// 1. Fetch buyers
GET /api/buyers

// 2. Get specific buyer details (auto-fetched when selected)
GET /api/buyers/1

// 3. Fetch products
GET /api/products

// 4. Calculate taxes for line items
POST /api/calculate-taxes
{
  "lineItems": [...],
  "sellerStateCode": "27",
  "buyerStateCode": "27"
}

// 5. Generate PDF
POST /api/generate-pdf
{
  "billData": {...}
}
```

---

For more information, see [README.md](./README.md)
