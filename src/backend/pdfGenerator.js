/**
 * PDF Generator Service
 * Generates professional PDF bills with proper branding, logo, and watermark
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import brandingConfig from '../config/branding.js';
import companyConfig from '../config/company.js';

class PDFGenerator {
  /**
   * Generate PDF from HTML content
   */
  static async generatePDF(htmlContent, options = {}) {
    let browser;
    try {
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

      const pdfOptions = {
        format: 'A4',
        margin: {
          top: '15mm',
          right: '15mm',
          bottom: '15mm',
          left: '15mm',
        },
        printBackground: true,
        ...options,
      };

      const pdf = await page.pdf(pdfOptions);
      await browser.close();
      return pdf;
    } catch (error) {
      if (browser) await browser.close();
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  }

  /**
   * Generate bill HTML with professional styling
   */
  static generateBillHTML(billData) {
    const {
      documentNumber,
      documentDate,
      dueDate,
      buyer,
      lineItems,
      totals,
    } = billData;

    const colors = brandingConfig.colors;
    const logoUrl = companyConfig.logoUrl;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: ${brandingConfig.fonts.primary};
            color: ${colors.text};
            background-color: #f9fafb;
            line-height: 1.6;
          }

          @page {
            size: A4;
            margin: 15mm;
            @bottom-center {
              content: "Page " counter(page) " of " counter(pages);
              font-size: 10px;
              color: ${colors.lightText};
            }
          }

          @media print {
            body {
              background-color: white;
            }
          }

          .container {
            width: 210mm;
            height: 297mm;
            padding: 15mm;
            background: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: 0 auto;
            position: relative;
          }

          /* Watermark */
          .watermark {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            z-index: 0;
            opacity: ${brandingConfig.watermark.opacity};
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
          }

          .watermark-text {
            font-size: 120px;
            font-weight: bold;
            color: ${brandingConfig.watermark.color};
            transform: rotate(-45deg);
            white-space: nowrap;
          }

          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 30px;
            border-bottom: 3px solid ${colors.primary};
            padding-bottom: 20px;
            position: relative;
            z-index: 1;
          }

          .logo-section {
            display: flex;
            align-items: center;
            gap: 20px;
          }

          .logo {
            width: 80px;
            height: 80px;
            background-color: ${colors.primary};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            text-align: center;
            padding: 5px;
          }

          .company-info h1 {
            color: ${colors.primary};
            font-size: 24px;
            margin-bottom: 5px;
          }

          .company-info p {
            font-size: 12px;
            color: ${colors.lightText};
            margin: 2px 0;
          }

          .document-type {
            background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary});
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            text-align: right;
          }

          .document-type h2 {
            font-size: 20px;
            margin-bottom: 5px;
          }

          .document-type p {
            font-size: 12px;
            opacity: 0.9;
          }

          .content {
            position: relative;
            z-index: 1;
          }

          .section {
            margin-bottom: 25px;
          }

          .section-title {
            background-color: ${colors.secondary};
            color: white;
            padding: 10px 15px;
            font-weight: bold;
            font-size: 13px;
            margin-bottom: 12px;
            border-radius: 4px;
          }

          .row {
            display: flex;
            gap: 40px;
            margin-bottom: 15px;
          }

          .column {
            flex: 1;
          }

          .field {
            font-size: 11px;
            margin-bottom: 8px;
          }

          .field-label {
            font-weight: bold;
            color: ${colors.primary};
            font-size: 11px;
          }

          .field-value {
            color: ${colors.text};
            font-size: 11px;
            margin-top: 2px;
          }

          /* Line Items Table */
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            font-size: 11px;
          }

          .items-table thead {
            background-color: ${colors.primary};
            color: white;
          }

          .items-table th {
            padding: 10px;
            text-align: left;
            font-weight: bold;
            border: 1px solid ${colors.border};
          }

          .items-table td {
            padding: 8px;
            border: 1px solid ${colors.border};
            text-align: right;
          }

          .items-table td:first-child,
          .items-table th:first-child {
            text-align: left;
          }

          .items-table tbody tr:nth-child(even) {
            background-color: #f3f4f6;
          }

          .items-table tbody tr:hover {
            background-color: #e0e7ff;
          }

          /* Totals Section */
          .totals-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 20px;
          }

          .totals-box {
            width: 50%;
            border: 2px solid ${colors.primary};
            border-radius: 4px;
            background-color: #f9fafb;
          }

          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 12px;
            border-bottom: 1px solid ${colors.border};
            font-size: 11px;
          }

          .total-row.summary {
            background-color: ${colors.primary};
            color: white;
            font-weight: bold;
            border-bottom: none;
            padding: 10px 12px;
          }

          .total-label {
            font-weight: 500;
          }

          .total-value {
            text-align: right;
          }

          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 2px solid ${colors.border};
            font-size: 10px;
            color: ${colors.lightText};
            text-align: center;
          }

          .footer p {
            margin: 3px 0;
          }

          @media print {
            .container {
              box-shadow: none;
              margin: 0;
              padding: 15mm;
            }

            body {
              margin: 0;
              padding: 0;
            }

            .page-break {
              page-break-after: always;
            }
          }
        </style>
      </head>
      <body>
        <div class="watermark">
          <div class="watermark-text">${brandingConfig.watermark.text}</div>
        </div>

        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="logo-section">
              <div class="logo">${companyConfig.name.substring(0, 2).toUpperCase()}</div>
              <div class="company-info">
                <h1>${companyConfig.name}</h1>
                <p>GSTIN: ${companyConfig.gstin}</p>
                <p>MSME: ${companyConfig.msmeNo}</p>
              </div>
            </div>
            <div class="document-type">
              <h2>TAX INVOICE</h2>
              <p>Document: ${documentNumber}</p>
              <p>Date: ${documentDate}</p>
            </div>
          </div>

          <!-- Content -->
          <div class="content">
            <!-- Seller and Buyer Information -->
            <div class="section">
              <div class="row">
                <div class="column">
                  <div class="section-title">SOLD BY</div>
                  <div class="field">
                    <div class="field-label">Company Name:</div>
                    <div class="field-value">${companyConfig.name}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Address:</div>
                    <div class="field-value">${companyConfig.address}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">GSTIN:</div>
                    <div class="field-value">${companyConfig.gstin}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Phone:</div>
                    <div class="field-value">${companyConfig.phone}</div>
                  </div>
                </div>
                <div class="column">
                  <div class="section-title">SOLD TO</div>
                  <div class="field">
                    <div class="field-label">Company Name:</div>
                    <div class="field-value">${buyer.companyName}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Address:</div>
                    <div class="field-value">${buyer.address}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">GSTIN:</div>
                    <div class="field-value">${buyer.gstin}</div>
                  </div>
                  <div class="field">
                    <div class="field-label">Contact:</div>
                    <div class="field-value">${buyer.phone || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Line Items -->
            <div class="section">
              <table class="items-table">
                <thead>
                  <tr>
                    <th>Item Description</th>
                    <th>HSN Code</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Rate</th>
                    <th>Taxable Value</th>
                    <th>Tax %</th>
                    <th>Tax Amount</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${lineItems.map(item => `
                    <tr>
                      <td style="text-align: left;">${item.description}</td>
                      <td>${item.hsnCode}</td>
                      <td>${item.quantity}</td>
                      <td>${item.unit}</td>
                      <td>₹${parseFloat(item.rate).toFixed(2)}</td>
                      <td>₹${parseFloat(item.taxableAmount).toFixed(2)}</td>
                      <td>${item.taxRate}%</td>
                      <td>₹${parseFloat(item.totalTax).toFixed(2)}</td>
                      <td>₹${parseFloat(item.totalAmount).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Totals -->
            <div class="totals-section">
              <div class="totals-box">
                <div class="total-row">
                  <span class="total-label">Subtotal (Taxable Value):</span>
                  <span class="total-value">₹${totals.taxableValue}</span>
                </div>
                <div class="total-row">
                  <span class="total-label">CGST:</span>
                  <span class="total-value">₹${totals.cgst}</span>
                </div>
                <div class="total-row">
                  <span class="total-label">SGST:</span>
                  <span class="total-value">₹${totals.sgst}</span>
                </div>
                <div class="total-row">
                  <span class="total-label">IGST:</span>
                  <span class="total-value">₹${totals.igst}</span>
                </div>
                <div class="total-row">
                  <span class="total-label">Round Off:</span>
                  <span class="total-value">₹${totals.roundOff}</span>
                </div>
                <div class="total-row summary">
                  <span class="total-label">Grand Total:</span>
                  <span class="total-value">₹${totals.grandTotal}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p>This is a computer-generated invoice. No signature is required.</p>
            <p>For queries, please contact: ${companyConfig.email} | Phone: ${companyConfig.phone}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default PDFGenerator;
