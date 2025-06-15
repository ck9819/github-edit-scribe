
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface QuotationData {
  quotationNumber: string;
  quotationDate: string;
  customer: {
    name: string;
    email: string;
    address?: string;
    phone?: string;
    gstin?: string;
  };
  items: Array<{
    description: string;
    hsnSacCode: string;
    quantity: number;
    unit: string;
    rate: number;
    taxableAmount: number;
    cgstAmount: number;
    sgstAmount: number;
    total: number;
  }>;
  totals: {
    totalTaxableAmount: number;
    totalCGST: number;
    totalSGST: number;
    grandTotal: number;
  };
  paymentTerms: string;
  deliveryPeriod: string;
  remarks?: string;
  validUntil: string;
  date: string;
}

const generateQuotationHTML = (data: QuotationData): string => {
  const itemsHTML = data.items.map((item, index) => `
    <tr>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
      <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.hsnSacCode}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.quantity}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.unit}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${item.rate.toFixed(2)}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${item.taxableAmount.toFixed(2)}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">9%</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${item.cgstAmount.toFixed(2)}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">9%</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">₹${item.sgstAmount.toFixed(2)}</td>
      <td style="border: 1px solid #ddd; padding: 8px; text-align: right; font-weight: bold;">₹${item.total.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Sales Quotation</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .company-info { flex: 1; }
        .quotation-details { flex: 1; text-align: right; }
        .customer-info { margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        .totals { margin-top: 20px; }
        .grand-total { font-size: 18px; font-weight: bold; }
        .terms { margin-top: 30px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="company-info">
          <h2>YES PEE ENGINEERING</h2>
          <p>#111/1, 11th cross Doddanna Indl. estate,<br>
          Near Peenya 2nd stage Bangalore (Karnataka)<br>
          India - 560091<br>
          Contact: 9739302867<br>
          GSTIN: 29AAOOPS8363N1ZP</p>
        </div>
        <div class="quotation-details">
          <h3>SALES QUOTATION</h3>
          <p><strong>Quotation No:</strong> ${data.quotationNumber}<br>
          <strong>Date:</strong> ${data.date}<br>
          <strong>Valid Until:</strong> ${data.validUntil}</p>
        </div>
      </div>

      <div class="customer-info">
        <h4>Buyer Details:</h4>
        <p><strong>${data.customer.name}</strong><br>
        ${data.customer.address || ''}<br>
        ${data.customer.phone || ''}<br>
        Email: ${data.customer.email}<br>
        ${data.customer.gstin ? `GSTIN: ${data.customer.gstin}` : ''}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>HSN/SAC Code</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Rate</th>
            <th>Taxable Amount</th>
            <th>CGST Rate</th>
            <th>CGST Amount</th>
            <th>SGST Rate</th>
            <th>SGST Amount</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="totals">
        <table style="width: 300px; margin-left: auto;">
          <tr>
            <td><strong>Total Taxable Amount:</strong></td>
            <td style="text-align: right;"><strong>₹${data.totals.totalTaxableAmount.toFixed(2)}</strong></td>
          </tr>
          <tr>
            <td><strong>Total CGST:</strong></td>
            <td style="text-align: right;"><strong>₹${data.totals.totalCGST.toFixed(2)}</strong></td>
          </tr>
          <tr>
            <td><strong>Total SGST:</strong></td>
            <td style="text-align: right;"><strong>₹${data.totals.totalSGST.toFixed(2)}</strong></td>
          </tr>
          <tr class="grand-total">
            <td><strong>Grand Total:</strong></td>
            <td style="text-align: right;"><strong>₹${data.totals.grandTotal.toFixed(2)}</strong></td>
          </tr>
        </table>
      </div>

      <div class="terms">
        <h4>Terms & Conditions:</h4>
        <p><strong>Payment Terms:</strong> ${data.paymentTerms}</p>
        <p><strong>Delivery Period:</strong> ${data.deliveryPeriod}</p>
        ${data.remarks ? `<p><strong>Remarks:</strong> ${data.remarks}</p>` : ''}
        <p>• All prices are in Indian Rupees (INR)</p>
        <p>• This quotation is valid until ${data.validUntil}</p>
        <p>• All disputes subject to Bangalore jurisdiction</p>
      </div>
    </body>
    </html>
  `;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { quotationData }: { quotationData: QuotationData } = await req.json();
    
    console.log("Generating quotation for:", quotationData.customer.email);

    // Generate HTML content
    const htmlContent = generateQuotationHTML(quotationData);

    // For now, we'll just log the HTML content
    // In a real implementation, you would:
    // 1. Convert HTML to PDF using a library like Puppeteer
    // 2. Send the PDF via email using a service like Resend
    
    console.log("Generated HTML content for quotation:", quotationData.quotationNumber);
    
    // Simulate successful email sending
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Quotation generated successfully",
        quotationNumber: quotationData.quotationNumber
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 200,
      }
    );

  } catch (error) {
    console.error("Error generating quotation:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
        status: 500,
      }
    );
  }
});
