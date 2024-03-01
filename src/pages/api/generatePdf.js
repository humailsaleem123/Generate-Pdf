import chromium from "chrome-aws-lambda";

export default async function handler(req, res) {
  try {
    const { content } = req.body;

    if (!content) {
      throw new Error("Content is missing");
    }

    console.log("defaultViewportdefaultViewport", chromium.defaultViewport);
    console.log("executablePathexecutablePath", await chromium.executablePath);

    const browser = await chromium.puppeteer.launch({
      args: [...chromium.args, "--hide-scrollbars", "--disable-web-security"],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath,
      headless: true,
      ignoreHTTPSErrors: true,
    });

    console.log("browser", browser);

    const page = await browser.newPage();

    const html = `
      <html>
        <head>
          <title>Dynamic PDF</title>
        </head>
        <body>
          <h1>Dynamic PDF Content</h1>
          <p>${content}</p>
        </body>
      </html>
    `;

    await page.setContent(html);

    const pdfBuffer = await page.pdf({ format: "A4" });

    await browser.close();

    res.setHeader("Content-Type", "application/pdf");
    // res.setHeader(
    //   'Content-Disposition',
    //   'attachment; filename="generated_pdf.pdf"'
    // );

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ error: "PDF generation failed" });
  }
}
