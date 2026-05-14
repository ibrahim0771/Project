/**
 * PDF Branding and Styling Configuration
 * Defines the visual identity for PDF documents
 */

export const brandingConfig = {
  // Color Scheme
  colors: {
    primary: process.env.PDF_COLOR_PRIMARY || '#1e40af', // Deep blue
    secondary: process.env.PDF_COLOR_SECONDARY || '#3b82f6', // Lighter blue
    accent: '#f59e0b', // Amber for highlights
    text: '#1f2937', // Dark gray for text
    lightText: '#6b7280', // Light gray for secondary text
    border: '#e5e7eb', // Border color
    success: '#10b981', // Green
    error: '#ef4444', // Red
    warning: '#f59e0b', // Amber
  },
  
  // Typography
  fonts: {
    primary: 'Arial, sans-serif',
    secondary: 'Courier New, monospace',
  },
  
  // Watermark Configuration
  watermark: {
    text: 'CONFIDENTIAL',
    opacity: parseFloat(process.env.PDF_WATERMARK_OPACITY || '0.1'),
    angle: -45,
    fontSize: 100,
    color: '#d1d5db', // Light gray
  },
  
  // Logo Configuration
  logo: {
    width: '80px',
    height: '80px',
    position: 'top-left',
    url: process.env.COMPANY_LOGO_URL || '/public/logo.png',
  },
  
  // Page Configuration
  page: {
    size: 'A4',
    margin: {
      top: '15mm',
      right: '15mm',
      bottom: '15mm',
      left: '15mm',
    },
    headerHeight: '30mm',
    footerHeight: '15mm',
  },
  
  // Print Margins
  printMargins: {
    top: 15,
    right: 15,
    bottom: 15,
    left: 15,
  },
};

export default brandingConfig;
