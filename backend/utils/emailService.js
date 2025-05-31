const nodemailer = require('nodemailer');
const config = require('../config/config');

/**
 * Create reusable transporter object using SMTP transport
 */
const transporter = nodemailer.createTransport(config.smtpConfig);

/**
 * Send invoice via email
 * @param {String} recipientEmail - Recipient email address
 * @param {String} subject - Email subject
 * @param {String} text - Plain text email body
 * @param {String} html - HTML email body
 * @param {Object} attachments - Email attachments
 * @returns {Promise} - Email sending result
 */
const sendEmail = async (recipientEmail, subject, text, html, attachments = []) => {
  // Setup email data
  const mailOptions = {
    from: `"Invoice System" <${config.emailFrom}>`,
    to: recipientEmail,
    subject,
    text,
    html,
    attachments
  };

  // Send mail with defined transport object
  return await transporter.sendMail(mailOptions);
};

/**
 * Send invoice email
 * @param {Object} invoice - Invoice data with populated client
 * @param {String} pdfPath - Path to invoice PDF
 * @param {String} publicLink - Optional public link to view invoice online
 * @returns {Promise} - Email sending result
 */
const sendInvoiceEmail = async (invoice, pdfPath, publicLink = null) => {
  const clientEmail = invoice.client.email;
  const subject = `Invoice ${invoice.invoiceNumber} from Your Company`;

  // Plain text version
  const text = `
    Dear ${invoice.client.name},

    Please find attached invoice ${invoice.invoiceNumber} in the amount of $${invoice.total.toFixed(2)}.
    
    Issue Date: ${new Date(invoice.issueDate).toLocaleDateString()}
    Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
    
    ${publicLink ? `You can also view your invoice online at: ${publicLink}` : ''}
    
    Thank you for your business.
    
    Regards,
    Your Company Name
  `;

  // HTML version
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Invoice ${invoice.invoiceNumber}</h2>
      
      <p>Dear ${invoice.client.name},</p>
      
      <p>Please find attached invoice ${invoice.invoiceNumber} in the amount of <strong>$${invoice.total.toFixed(2)}</strong>.</p>
      
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Issue Date:</strong> ${new Date(invoice.issueDate).toLocaleDateString()}</p>
        <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString()}</p>
        <p><strong>Amount Due:</strong> $${invoice.total.toFixed(2)}</p>
      </div>
      
      ${publicLink ? `<p>You can also <a href="${publicLink}" style="color: #0066cc;">view your invoice online</a>.</p>` : ''}
      
      <p>Thank you for your business.</p>
      
      <p>Regards,<br>Your Company Name</p>
    </div>
  `;

  // Attachments
  const attachments = [
    {
      filename: `Invoice-${invoice.invoiceNumber}.pdf`,
      path: pdfPath,
      contentType: 'application/pdf'
    }
  ];

  return await sendEmail(clientEmail, subject, text, html, attachments);
};

module.exports = {
  sendEmail,
  sendInvoiceEmail
};