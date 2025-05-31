const pdf = require('html-pdf');

/**
 * Generate PDF from invoice data
 * @param {Object} invoice - Invoice data
 * @returns {Promise<Buffer>} - PDF buffer
 */
const generatePDF = (invoice) => {
    return new Promise((resolve, reject) => {
        // Create HTML template
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${invoice.invoiceNo}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .invoice-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .invoice-details {
            margin-bottom: 20px;
          }
          .invoice-details div {
            margin-bottom: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
          .totals {
            width: 300px;
            margin-left: auto;
          }
          .totals div {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
          }
          .grand-total {
            font-weight: bold;
            font-size: 18px;
            border-top: 2px solid #333;
            padding-top: 5px;
          }
          .notes {
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div>
            <div class="invoice-title">INVOICE</div>
            <div>Invoice #: ${invoice.invoiceNo}</div>
            <div>Date: ${new Date(invoice.createdAt).toLocaleDateString()}</div>
            ${invoice.dueDate ? `<div>Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}</div>` : ''}
          </div>
        </div>

        <div class="invoice-details">
          <div style="font-weight: bold; margin-bottom: 5px;">Bill To:</div>
          <div>${invoice.client.name}</div>
          <div>${invoice.client.email}</div>
          ${invoice.client.phone ? `<div>${invoice.client.phone}</div>` : ''}
          ${invoice.client.address ? `
            <div>
              ${invoice.client.address.street || ''}, 
              ${invoice.client.address.city || ''}, 
              ${invoice.client.address.state || ''} 
              ${invoice.client.address.zipCode || ''}, 
              ${invoice.client.address.country || ''}
            </div>
          ` : ''}
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Rate</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            ${invoice.items.map(item => `
              <tr>
                <td>${item.description}</td>
                <td>${item.quantity}</td>
                <td>$${item.rate.toFixed(2)}</td>
                <td>$${item.amount.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="totals">
          <div>
            <span>Subtotal:</span>
            <span>$${invoice.totalAmount.toFixed(2)}</span>
          </div>
          ${invoice.tax ? `
            <div>
              <span>Tax (${invoice.tax}%):</span>
              <span>$${(invoice.totalAmount * invoice.tax / 100).toFixed(2)}</span>
            </div>
          ` : ''}
          ${invoice.discount ? `
            <div>
              <span>Discount (${invoice.discount}%):</span>
              <span>$${(invoice.totalAmount * invoice.discount / 100).toFixed(2)}</span>
            </div>
          ` : ''}
          <div class="grand-total">
            <span>Total:</span>
            <span>$${invoice.grandTotal.toFixed(2)}</span>
          </div>
        </div>

        ${invoice.notes ? `
          <div class="notes">
            <div style="font-weight: bold; margin-bottom: 5px;">Notes:</div>
            <div>${invoice.notes}</div>
          </div>
        ` : ''}

        ${invoice.terms ? `
          <div class="notes">
            <div style="font-weight: bold; margin-bottom: 5px;">Terms:</div>
            <div>${invoice.terms}</div>
          </div>
        ` : ''}
      </body>
      </html>
    `;

        // Options for PDF generation
        const options = {
            format: 'A4',
            border: {
                top: '15mm',
                right: '15mm',
                bottom: '15mm',
                left: '15mm'
            }
        };

        // Generate PDF
        pdf.create(html, options).toBuffer((err, buffer) => {
            if (err) {
                reject(err);
            } else {
                resolve(buffer);
            }
        });
    });
};

module.exports = generatePDF;