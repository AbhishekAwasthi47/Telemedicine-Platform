const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const crypto = require('crypto');
// TODO: Save to DB? Requirements didn't strictly say, just generate and verifiable. I'll just stream it for now.

const generatePrescription = async (req, res) => {
  try {
    const { patientName, doctorName, medications, notes } = req.body;

    // 1. Generate cryptographic hash for verification
    const prescriptionData = JSON.stringify({ patientName, doctorName, medications, notes });
    // AES-256 hash or just SHA256 is enough for a signature/verification hash usually? The prompt says cryptographic hash.
    const hash = crypto.createHash('sha256').update(prescriptionData).digest('hex');

    // 2. Generate QR Code
    // I'll make a QR code out of the hash. A pharmacy could scan this and check if it matches the text.
    const qrCodeDataUrl = await QRCode.toDataURL(hash);

    // Create a document
    const doc = new PDFDocument();

    // Pipe its output currently to the response directly
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=prescription_${Date.now()}.pdf`);
    doc.pipe(res);

    // Add some content to the PDF
    doc.fontSize(25).text('Digital Prescription', { align: 'center' });
    doc.moveDown();
    
    doc.fontSize(14).text(`Doctor: ${doctorName}`);
    doc.text(`Patient: ${patientName}`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(18).text('Medications:');
    doc.fontSize(12);
    if (Array.isArray(medications)) {
        medications.forEach((med, index) => {
            doc.text(`${index + 1}. ${med}`);
        });
    } else {
        doc.text(medications);
    }
    
    doc.moveDown();
    doc.fontSize(14).text('Notes:');
    doc.fontSize(12).text(notes || 'None');
    
    doc.moveDown();
    doc.text('Verification Hash: ' + hash, { width: 410, align: 'left' });

    // Embed the QR Code
    // QRCode.toDataURL returns a base64 string like "data:image/png;base64,..."
    // We need to strip the prefix for PDFKit
    const base64Data = qrCodeDataUrl.replace(/^data:image\/png;base64,/, "");
    const imgBuffer = Buffer.from(base64Data, 'base64');
    
    doc.image(imgBuffer, 200, doc.y + 20, { fit: [100, 100] });

    // Finalize PDF file
    doc.end();

  } catch (err) {
    console.error("Oops, PDF generation failed:", err);
    res.status(500).json({ error: 'Failed to generate prescription PDF' });
  }
};

module.exports = {
  generatePrescription
};
