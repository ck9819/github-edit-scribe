
const { PDFDocument, rgb } = require('pdf-lib');
const nodemailer = require('nodemailer');

async function GeneratePdf (req, res) {
  const {
    supplierName,
    supplierAddress,
    supplierContact,
    supplierEmail,
    buyerName,
    buyerAddress,
    buyerContact,
    buyerEmail,
    deliveryLocation,
    sqNumber,
    sqDate,
    deliveryDate,
    enquiryNumber,
    noOfItems,
    paymentTerms,
    customerEnquiryNumber
  } = req.body;
  console.log("inside send pdf", req.body)

  try {
    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();

    // Supplier Details
    page.drawText(`Supplier Name: ${supplierName}`, { x: 50, y: height - 50, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`Supplier Address: ${supplierAddress}`, { x: 50, y: height - 70, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`Supplier Contact: ${supplierContact}`, { x: 50, y: height - 90, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`Supplier Email: ${supplierEmail}`, { x: 50, y: height - 110, size: 12, color: rgb(0, 0, 0) });

    // Buyer Details
    page.drawText(`Buyer Name: ${buyerName}`, { x: 50, y: height - 150, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`Buyer Address: ${buyerAddress}`, { x: 50, y: height - 170, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`Buyer Contact: ${buyerContact}`, { x: 50, y: height - 190, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`Buyer Email: ${buyerEmail}`, { x: 50, y: height - 210, size: 12, color: rgb(0, 0, 0) });

    // Delivery Location
    page.drawText(`Delivery Location: ${deliveryLocation}`, { x: 50, y: height - 250, size: 12, color: rgb(0, 0, 0) });

    // SQ Details
    page.drawText(`SQ Number: ${sqNumber}`, { x: 50, y: height - 290, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`SQ Date: ${sqDate}`, { x: 50, y: height - 310, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`Delivery Date: ${deliveryDate}`, { x: 50, y: height - 330, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`Enquiry Number: ${enquiryNumber}`, { x: 50, y: height - 350, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`No of Items: ${noOfItems}`, { x: 50, y: height - 370, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`Payment Terms: ${paymentTerms}`, { x: 50, y: height - 390, size: 12, color: rgb(0, 0, 0) });
    page.drawText(`Customer Enquiry Number: ${customerEnquiryNumber}`, { x: 50, y: height - 410, size: 12, color: rgb(0, 0, 0) });

    const pdfBytes = await pdfDoc.save();

    // Send PDF via Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'password'
      }
    });
   // console.log('mail',transporter);

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: buyerEmail,
      subject: 'Sales Quotation',
      text: 'Please find attached the sales quotation.',
      attachments: [
        {
          filename: 'quotation.pdf',
          content: pdfBytes,
          contentType: 'application/pdf'
        }
      ]
    };
console.log("mailOptions", mailOptions)
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Error sending email',error });
        
      }
      res.status(200).send('PDF sent successfully!');
    });
  } catch (error) {
    res.status(500).send('Error creating PDF', error);
  }
};

module.exports = {GeneratePdf}


