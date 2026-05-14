/**
 * Main API Router
 * Handles all billing-related API endpoints
 */

import express from 'express';
import { googleSheetsConnector } from './googleSheetsConnector.js';
import TaxCalculator from './taxCalculator.js';
import PDFGenerator from './pdfGenerator.js';

const router = express.Router();

/**
 * GET /api/buyers
 * Fetch all buyers from Google Sheets
 */
router.get('/buyers', async (req, res) => {
  try {
    const buyers = await googleSheetsConnector.fetchBuyers();
    res.json({
      success: true,
      data: buyers,
      count: buyers.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch buyers',
      message: error.message,
    });
  }
});

/**
 * GET /api/buyers/:id
 * Fetch a specific buyer by ID
 */
router.get('/buyers/:id', async (req, res) => {
  try {
    const buyer = await googleSheetsConnector.getBuyerById(req.params.id);
    if (!buyer) {
      return res.status(404).json({
        success: false,
        error: 'Buyer not found',
      });
    }
    res.json({
      success: true,
      data: buyer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch buyer',
      message: error.message,
    });
  }
});

/**
 * GET /api/products
 * Fetch all products from Google Sheets
 */
router.get('/products', async (req, res) => {
  try {
    const products = await googleSheetsConnector.fetchProducts();
    res.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message,
    });
  }
});

/**
 * GET /api/products/:id
 * Fetch a specific product by ID
 */
router.get('/products/:id', async (req, res) => {
  try {
    const product = await googleSheetsConnector.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found',
      });
    }
    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message,
    });
  }
});

/**
 * POST /api/calculate-taxes
 * Calculate tax and total for line items
 * Body: { lineItems: [...], sellerStateCode: string, buyerStateCode: string }
 */
router.post('/calculate-taxes', (req, res) => {
  try {
    const { lineItems, sellerStateCode = '27', buyerStateCode = '27', roundOff = 0 } = req.body;

    if (!lineItems || !Array.isArray(lineItems)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid line items',
      });
    }

    // Calculate taxes for each line item
    const calculatedItems = lineItems.map(item => {
      return TaxCalculator.calculateLineItem(
        item.quantity,
        item.rate,
        item.taxRate,
        sellerStateCode,
        buyerStateCode
      );
    });

    // Calculate totals
    const totals = TaxCalculator.getTaxSummary(calculatedItems, roundOff);

    res.json({
      success: true,
      data: {
        lineItems: calculatedItems,
        totals: totals,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Tax calculation failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/generate-pdf
 * Generate PDF bill
 * Body: { billData: {...} }
 */
router.post('/generate-pdf', async (req, res) => {
  try {
    const { billData } = req.body;

    if (!billData) {
      return res.status(400).json({
        success: false,
        error: 'Bill data is required',
      });
    }

    // Generate HTML
    const htmlContent = PDFGenerator.generateBillHTML(billData);

    // Generate PDF
    const pdf = await PDFGenerator.generatePDF(htmlContent, {
      format: 'A4',
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      },
    });

    // Send PDF as response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${billData.documentNumber}.pdf"`);
    res.send(pdf);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'PDF generation failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/preview-bill
 * Generate HTML preview of the bill
 * Body: { billData: {...} }
 */
router.post('/preview-bill', (req, res) => {
  try {
    const { billData } = req.body;

    if (!billData) {
      return res.status(400).json({
        success: false,
        error: 'Bill data is required',
      });
    }

    const htmlContent = PDFGenerator.generateBillHTML(billData);

    res.json({
      success: true,
      data: {
        html: htmlContent,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Preview generation failed',
      message: error.message,
    });
  }
});

/**
 * POST /api/refresh-cache
 * Clear and refresh cached data from Google Sheets
 */
router.post('/refresh-cache', (req, res) => {
  try {
    googleSheetsConnector.clearCache();
    res.json({
      success: true,
      message: 'Cache cleared successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Cache refresh failed',
      message: error.message,
    });
  }
});

export default router;
