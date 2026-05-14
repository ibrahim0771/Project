/**
 * Static Company Configuration
 * Contains company-wide information that remains constant across all bills
 * Should NOT include any buyer-related information
 */

export const companyConfig = {
  // Basic Company Information
  name: process.env.COMPANY_NAME || 'Mahaind Overseas Pvt Ltd',
  gstin: process.env.COMPANY_GSTIN || '27AAQCM7594N1ZA',
  msmeNo: process.env.COMPANY_MSME_NO || 'UDYAM-MH-26-0458799',
  
  // Address Information
  address: process.env.COMPANY_ADDRESS || 'Bhairat Patil Industrial Park Gat No 537 & 538, Badhalwadi (Navlakh Umbre), Taluka: Maval, Dist: Pune 410507',
  
  // Contact Information
  phone: process.env.COMPANY_PHONE || '+91-XXXXXXXXXX',
  email: process.env.COMPANY_EMAIL || 'info@example.com',
  website: process.env.COMPANY_WEBSITE || 'www.example.com',
  
  // Branding
  logoUrl: process.env.COMPANY_LOGO_URL || '/public/logo.png',
  
  // Tax Configuration
  gstState: '27', // Maharashtra
  defaultGstRate: 18, // Default GST rate (18%)
  
  // Document Configuration
  invoicePrefix: 'MOPL',
  quotationPrefix: 'QUOTE',
  deliveryChailanPrefix: 'DC',
  
  // Bank Information (optional, for future use)
  bankName: 'State Bank of India',
  accountNumber: 'XXXXXXXXXXXX',
  ifscCode: 'SBIN0XXXXX',
};

export default companyConfig;
