/**
 * Tax Calculation Engine
 * Handles GST and other tax calculations
 */

class TaxCalculator {
  /**
   * Calculate CGST and SGST based on state code
   * For same state transactions, use SGST
   * For inter-state transactions, use IGST
   */
  static calculateGST(amount, taxRate, sellerStateCode, buyerStateCode) {
    const taxableAmount = parseFloat(amount) || 0;
    const rate = parseFloat(taxRate) || 18;

    if (sellerStateCode === buyerStateCode) {
      // Intra-state transaction - CGST + SGST
      const halfRate = rate / 2;
      return {
        cgst: (taxableAmount * halfRate) / 100,
        sgst: (taxableAmount * halfRate) / 100,
        igst: 0,
        totalTax: (taxableAmount * rate) / 100,
        type: 'CGST+SGST',
      };
    } else {
      // Inter-state transaction - IGST
      return {
        cgst: 0,
        sgst: 0,
        igst: (taxableAmount * rate) / 100,
        totalTax: (taxableAmount * rate) / 100,
        type: 'IGST',
      };
    }
  }

  /**
   * Calculate line item totals
   */
  static calculateLineItem(quantity, rate, taxRate = 18, sellerState = '27', buyerState = '27') {
    const qty = parseFloat(quantity) || 0;
    const unitRate = parseFloat(rate) || 0;
    const taxableAmount = qty * unitRate;

    const tax = this.calculateGST(taxableAmount, taxRate, sellerState, buyerState);

    return {
      quantity: qty,
      rate: unitRate,
      taxableAmount: taxableAmount,
      cgst: tax.cgst,
      sgst: tax.sgst,
      igst: tax.igst,
      totalTax: tax.totalTax,
      totalAmount: taxableAmount + tax.totalTax,
      taxType: tax.type,
      taxRate: taxRate,
    };
  }

  /**
   * Calculate bill totals from line items
   */
  static calculateBillTotals(lineItems, roundOff = 0) {
    const totals = {
      totalQuantity: 0,
      subtaxableAmount: 0,
      totalCGST: 0,
      totalSGST: 0,
      totalIGST: 0,
      totalTax: 0,
      roundOff: roundOff,
      grandTotal: 0,
    };

    lineItems.forEach(item => {
      totals.totalQuantity += item.quantity;
      totals.subtaxableAmount += item.taxableAmount;
      totals.totalCGST += item.cgst;
      totals.totalSGST += item.sgst;
      totals.totalIGST += item.igst;
      totals.totalTax += item.totalTax;
    });

    // Round off to nearest rupee if needed
    totals.subtotal = totals.subtaxableAmount + totals.totalTax;
    totals.grandTotal = totals.subtotal + totals.roundOff;

    return totals;
  }

  /**
   * Format currency value
   */
  static formatCurrency(amount) {
    return parseFloat(amount || 0).toFixed(2);
  }

  /**
   * Get tax summary for display
   */
  static getTaxSummary(lineItems, roundOff = 0) {
    const totals = this.calculateBillTotals(lineItems, roundOff);
    
    return {
      taxableValue: this.formatCurrency(totals.subtaxableAmount),
      cgst: this.formatCurrency(totals.totalCGST),
      sgst: this.formatCurrency(totals.totalSGST),
      igst: this.formatCurrency(totals.totalIGST),
      totalTax: this.formatCurrency(totals.totalTax),
      roundOff: this.formatCurrency(totals.roundOff),
      grandTotal: this.formatCurrency(totals.grandTotal),
    };
  }
}

export default TaxCalculator;
