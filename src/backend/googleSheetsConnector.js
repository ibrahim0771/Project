/**
 * Google Sheets Data Connector
 * Handles fetching data from Google Sheets for buyers and products
 */

import { google } from 'googleapis';
import googleSheetsConfig from '../config/googleSheets.js';

class GoogleSheetsConnector {
  constructor() {
    this.cache = new Map();
    this.sheets = google.sheets('v4');
    this.apiKey = googleSheetsConfig.apiKey;
    this.buyersCache = null;
    this.productsCache = null;
    this.lastCacheTime = null;
  }

  /**
   * Check if cache is still valid
   */
  isCacheValid() {
    if (!this.lastCacheTime) return false;
    const now = Date.now();
    return (now - this.lastCacheTime) < (googleSheetsConfig.cacheExpiry * 1000);
  }

  /**
   * Fetch buyers from Google Sheets
   */
  async fetchBuyers() {
    if (this.isCacheValid() && this.buyersCache) {
      return this.buyersCache;
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: googleSheetsConfig.sheets.buyers.sheetId,
        range: googleSheetsConfig.sheets.buyers.range,
        key: this.apiKey,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        return [];
      }

      // Skip header row and map to buyer objects
      const buyers = rows.slice(1).map((row, index) => ({
        id: index + 1,
        companyName: row[0] || '',
        gstin: row[1] || '',
        address: row[2] || '',
        contactPerson: row[3] || '',
        phone: row[4] || '',
        email: row[5] || '',
        stateCode: row[6] || '27', // Default to Maharashtra
      })).filter(buyer => buyer.companyName); // Filter out empty rows

      this.buyersCache = buyers;
      this.lastCacheTime = Date.now();
      return buyers;
    } catch (error) {
      console.error('Error fetching buyers:', error);
      return [];
    }
  }

  /**
   * Fetch products from Google Sheets
   */
  async fetchProducts() {
    if (this.isCacheValid() && this.productsCache) {
      return this.productsCache;
    }

    try {
      const response = await this.sheets.spreadsheets.values.get({
        spreadsheetId: googleSheetsConfig.sheets.products.sheetId,
        range: googleSheetsConfig.sheets.products.range,
        key: this.apiKey,
      });

      const rows = response.data.values || [];
      if (rows.length === 0) {
        return [];
      }

      // Skip header row and map to product objects
      const products = rows.slice(1).map((row, index) => ({
        id: index + 1,
        productName: row[0] || '',
        hsn: row[1] || '',
        unit: row[2] || 'Nos',
        defaultRate: parseFloat(row[3]) || 0,
        taxRate: parseFloat(row[4]) || 18,
      })).filter(product => product.productName); // Filter out empty rows

      this.productsCache = products;
      this.lastCacheTime = Date.now();
      return products;
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  }

  /**
   * Get buyer by ID
   */
  async getBuyerById(buyerId) {
    const buyers = await this.fetchBuyers();
    return buyers.find(buyer => buyer.id === parseInt(buyerId));
  }

  /**
   * Get product by ID
   */
  async getProductById(productId) {
    const products = await this.fetchProducts();
    return products.find(product => product.id === parseInt(productId));
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.buyersCache = null;
    this.productsCache = null;
    this.lastCacheTime = null;
  }
}

export const googleSheetsConnector = new GoogleSheetsConnector();
export default GoogleSheetsConnector;
