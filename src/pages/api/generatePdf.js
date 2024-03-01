// pages/api/generate-pdf.js
import htmlToPdf from "html-pdf";

export default function handler(req, res) {
  // You should handle POST request with XML data in req.body
  if (req.method === "POST") {
    const xmlData = req.body;
    const htmlData = convertXmlToHtml(xmlData);

    // Generate PDF
    htmlToPdf.create(htmlData).toBuffer((err, buffer) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error generating PDF");
        return;
      }

      // Send the PDF as response
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=sample.pdf");
      res.send(buffer);
    });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}

const convertXmlToHtml = (xmlData) => {
  // Your XML to HTML conversion logic here
  // You might use a library like xml2js or custom parsing
  return `<html><body>${xmlData}</body></html>`;
};
