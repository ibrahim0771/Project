/**
 * Billing Form JavaScript
 * Handles form interactions, calculations, and API calls
 */

const API_BASE_URL = 'http://localhost:3000/api';

// Global state
let buyers = [];
let products = [];
let lineItems = [];
let selectedBuyer = null;

/**
 * Initialize the form on page load
 */
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('documentDate').value = today;

    // Load initial data
    loadBuyers();
    loadProducts();

    // Add form submit listener
    document.getElementById('billForm').addEventListener('submit', handleFormSubmit);

    // Add round-off change listener
    document.getElementById('roundOff').addEventListener('change', updateCalculations);

    // Add initial line item
    addLineItem();
});

/**
 * Load buyers from API
 */
async function loadBuyers() {
    try {
        const response = await fetch(`${API_BASE_URL}/buyers`);
        const data = await response.json();

        if (data.success) {
            buyers = data.data;
            populateBuyerDropdown();
            showAlert('Buyers loaded successfully', 'success');
        } else {
            showAlert('Failed to load buyers', 'error');
        }
    } catch (error) {
        console.error('Error loading buyers:', error);
        showAlert('Error loading buyers: ' + error.message, 'error');
    }
}

/**
 * Load products from API
 */
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const data = await response.json();

        if (data.success) {
            products = data.data;
            showAlert('Products loaded successfully', 'success');
        } else {
            showAlert('Failed to load products', 'error');
        }
    } catch (error) {
        console.error('Error loading products:', error);
        showAlert('Error loading products: ' + error.message, 'error');
    }
}

/**
 * Populate the buyer dropdown
 */
function populateBuyerDropdown() {
    const select = document.getElementById('buyerSelect');
    select.innerHTML = '<option value="">-- Select a buyer --</option>';

    buyers.forEach(buyer => {
        const option = document.createElement('option');
        option.value = buyer.id;
        option.textContent = buyer.companyName;
        select.appendChild(option);
    });
}

/**
 * Handle buyer selection change
 */
function handleBuyerChange() {
    const buyerId = document.getElementById('buyerSelect').value;

    if (!buyerId) {
        clearBuyerFields();
        selectedBuyer = null;
        return;
    }

    selectedBuyer = buyers.find(b => b.id === parseInt(buyerId));

    if (selectedBuyer) {
        document.getElementById('buyerName').value = selectedBuyer.companyName;
        document.getElementById('buyerGSTIN').value = selectedBuyer.gstin;
        document.getElementById('buyerAddress').value = selectedBuyer.address;
        document.getElementById('buyerState').value = selectedBuyer.stateCode || '27';

        // Recalculate taxes if there are line items
        if (lineItems.length > 0) {
            updateCalculations();
        }
    }
}

/**
 * Clear buyer fields
 */
function clearBuyerFields() {
    document.getElementById('buyerName').value = '';
    document.getElementById('buyerGSTIN').value = '';
    document.getElementById('buyerAddress').value = '';
    document.getElementById('buyerState').value = '';
}

/**
 * Add a new line item
 */
function addLineItem(product = null) {
    const itemId = Date.now();
    const item = {
        id: itemId,
        productId: product?.id || '',
        description: product?.productName || '',
        hsnCode: product?.hsn || '',
        quantity: 1,
        unit: product?.unit || 'Nos',
        rate: product?.defaultRate || 0,
        taxRate: product?.taxRate || 18,
    };

    lineItems.push(item);
    renderLineItems();
    updateCalculations();
}

/**
 * Render line items table
 */
function renderLineItems() {
    const tbody = document.getElementById('lineItemsBody');
    tbody.innerHTML = '';

    lineItems.forEach((item, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <select onchange="updateProductFromDropdown(${item.id}, this.value)" style="width: 100%; padding: 6px;">
                    <option value="">-- Custom Item --</option>
                    ${products.map(p => `<option value="${p.id}" ${p.id === item.productId ? 'selected' : ''}>${p.productName}</option>`).join('')}
                </select>
            </td>
            <td>
                <input type="text" value="${item.description}" onchange="updateLineItem(${item.id}, 'description', this.value)">
            </td>
            <td>
                <input type="text" value="${item.hsnCode}" onchange="updateLineItem(${item.id}, 'hsnCode', this.value)">
            </td>
            <td>
                <input type="number" min="0" step="0.01" value="${item.quantity}" onchange="updateLineItem(${item.id}, 'quantity', this.value)">
            </td>
            <td>
                <input type="text" value="${item.unit}" onchange="updateLineItem(${item.id}, 'unit', this.value)">
            </td>
            <td>
                <input type="number" min="0" step="0.01" value="${item.rate}" onchange="updateLineItem(${item.id}, 'rate', this.value)">
            </td>
            <td>
                <input type="number" min="0" step="1" value="${item.taxRate}" onchange="updateLineItem(${item.id}, 'taxRate', this.value)">
            </td>
            <td>
                ₹ ${calculateLineItemTotal(item).toFixed(2)}
            </td>
            <td>
                <button type="button" class="btn-small btn-remove" onclick="removeLineItem(${item.id})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

/**
 * Update product from dropdown
 */
function updateProductFromDropdown(itemId, productId) {
    if (!productId) return;

    const product = products.find(p => p.id === parseInt(productId));
    if (!product) return;

    const itemIndex = lineItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        lineItems[itemIndex] = {
            ...lineItems[itemIndex],
            productId: product.id,
            description: product.productName,
            hsnCode: product.hsn,
            unit: product.unit,
            rate: product.defaultRate,
            taxRate: product.taxRate,
        };

        renderLineItems();
        updateCalculations();
    }
}

/**
 * Update a line item field
 */
function updateLineItem(itemId, field, value) {
    const itemIndex = lineItems.findIndex(item => item.id === itemId);
    if (itemIndex !== -1) {
        lineItems[itemIndex][field] = isNaN(value) ? value : parseFloat(value);
        updateCalculations();
    }
}

/**
 * Remove a line item
 */
function removeLineItem(itemId) {
    lineItems = lineItems.filter(item => item.id !== itemId);
    renderLineItems();
    updateCalculations();
}

/**
 * Calculate line item total
 */
function calculateLineItemTotal(item) {
    const taxableAmount = item.quantity * item.rate;
    const taxAmount = (taxableAmount * item.taxRate) / 100;
    return taxableAmount + taxAmount;
}

/**
 * Update calculations
 */
async function updateCalculations() {
    if (lineItems.length === 0) {
        clearSummary();
        return;
    }

    try {
        const roundOff = parseFloat(document.getElementById('roundOff').value) || 0;
        const sellerStateCode = '27'; // Company state code
        const buyerStateCode = selectedBuyer?.stateCode || '27';

        const response = await fetch(`${API_BASE_URL}/calculate-taxes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                lineItems: lineItems.map(item => ({
                    quantity: item.quantity,
                    rate: item.rate,
                    taxRate: item.taxRate,
                })),
                sellerStateCode,
                buyerStateCode,
                roundOff,
            }),
        });

        const data = await response.json();

        if (data.success) {
            updateSummary(data.data.totals);
        } else {
            showAlert('Calculation failed: ' + data.error, 'error');
        }
    } catch (error) {
        console.error('Error calculating taxes:', error);
        showAlert('Error calculating taxes: ' + error.message, 'error');
    }
}

/**
 * Update summary display
 */
function updateSummary(totals) {
    document.getElementById('summaryTaxableValue').textContent = `₹ ${parseFloat(totals.taxableValue).toFixed(2)}`;
    document.getElementById('summaryCGST').textContent = `₹ ${parseFloat(totals.cgst).toFixed(2)}`;
    document.getElementById('summarySGST').textContent = `₹ ${parseFloat(totals.sgst).toFixed(2)}`;
    document.getElementById('summaryIGST').textContent = `₹ ${parseFloat(totals.igst).toFixed(2)}`;
    document.getElementById('summaryGrandTotal').textContent = `₹ ${parseFloat(totals.grandTotal).toFixed(2)}`;
}

/**
 * Clear summary
 */
function clearSummary() {
    document.getElementById('summaryTaxableValue').textContent = '₹ 0.00';
    document.getElementById('summaryCGST').textContent = '₹ 0.00';
    document.getElementById('summarySGST').textContent = '₹ 0.00';
    document.getElementById('summaryIGST').textContent = '₹ 0.00';
    document.getElementById('summaryGrandTotal').textContent = '₹ 0.00';
}

/**
 * Preview the bill
 */
async function previewBill() {
    if (!validateForm()) {
        showAlert('Please fill in all required fields and add at least one line item', 'warning');
        return;
    }

    try {
        // Get totals
        const roundOff = parseFloat(document.getElementById('roundOff').value) || 0;
        const sellerStateCode = '27';
        const buyerStateCode = selectedBuyer?.stateCode || '27';

        const taxResponse = await fetch(`${API_BASE_URL}/calculate-taxes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lineItems: lineItems.map(item => ({
                    quantity: item.quantity,
                    rate: item.rate,
                    taxRate: item.taxRate,
                })),
                sellerStateCode,
                buyerStateCode,
                roundOff,
            }),
        });

        const taxData = await taxResponse.json();

        if (!taxData.success) {
            showAlert('Failed to calculate totals', 'error');
            return;
        }

        const billData = {
            documentNumber: document.getElementById('documentNumber').value,
            documentDate: document.getElementById('documentDate').value,
            dueDate: document.getElementById('dueDate').value,
            buyer: selectedBuyer,
            lineItems: lineItems,
            totals: taxData.data.totals,
        };

        const previewResponse = await fetch(`${API_BASE_URL}/preview-bill`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ billData }),
        });

        const previewData = await previewResponse.json();

        if (previewData.success) {
            document.getElementById('previewContent').innerHTML = previewData.data.html;
            document.getElementById('previewModal').classList.add('show');
        } else {
            showAlert('Failed to generate preview', 'error');
        }
    } catch (error) {
        console.error('Error previewing bill:', error);
        showAlert('Error generating preview: ' + error.message, 'error');
    }
}

/**
 * Close preview modal
 */
function closePreview() {
    document.getElementById('previewModal').classList.remove('show');
}

/**
 * Save as draft
 */
function saveDraft() {
    const draft = {
        documentNumber: document.getElementById('documentNumber').value,
        documentDate: document.getElementById('documentDate').value,
        dueDate: document.getElementById('dueDate').value,
        buyerId: selectedBuyer?.id,
        lineItems: lineItems,
        roundOff: document.getElementById('roundOff').value,
        timestamp: new Date().toISOString(),
    };

    localStorage.setItem('billDraft', JSON.stringify(draft));
    showAlert('Bill saved as draft successfully', 'success');
}

/**
 * Validate form
 */
function validateForm() {
    const documentNumber = document.getElementById('documentNumber').value;
    const documentDate = document.getElementById('documentDate').value;
    const buyerId = document.getElementById('buyerSelect').value;

    return documentNumber && documentDate && buyerId && lineItems.length > 0;
}

/**
 * Handle form submission (Generate PDF)
 */
async function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        showAlert('Please fill in all required fields and add at least one line item', 'warning');
        return;
    }

    try {
        const roundOff = parseFloat(document.getElementById('roundOff').value) || 0;
        const sellerStateCode = '27';
        const buyerStateCode = selectedBuyer?.stateCode || '27';

        const taxResponse = await fetch(`${API_BASE_URL}/calculate-taxes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                lineItems: lineItems.map(item => ({
                    quantity: item.quantity,
                    rate: item.rate,
                    taxRate: item.taxRate,
                })),
                sellerStateCode,
                buyerStateCode,
                roundOff,
            }),
        });

        const taxData = await taxResponse.json();

        if (!taxData.success) {
            showAlert('Failed to calculate totals', 'error');
            return;
        }

        const billData = {
            documentNumber: document.getElementById('documentNumber').value,
            documentDate: document.getElementById('documentDate').value,
            dueDate: document.getElementById('dueDate').value,
            buyer: selectedBuyer,
            lineItems: lineItems,
            totals: taxData.data.totals,
        };

        const pdfResponse = await fetch(`${API_BASE_URL}/generate-pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ billData }),
        });

        if (!pdfResponse.ok) {
            showAlert('Failed to generate PDF', 'error');
            return;
        }

        const blob = await pdfResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${billData.documentNumber}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

        showAlert('PDF generated and downloaded successfully', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        showAlert('Error generating PDF: ' + error.message, 'error');
    }
}

/**
 * Show alert message
 */
function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('alertBox');
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} show`;
    alert.textContent = message;

    alertBox.innerHTML = '';
    alertBox.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}
