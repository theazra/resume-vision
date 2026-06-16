import puppeteer from 'puppeteer';

export const generatePDF = async (req, res) => {
    const { html, css } = req.body;

    if (!html) {
        return res.status(400).json({ message: 'HTML content required' });
    }

    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true, // or 'new' depending on version, true is safe for v23+
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Set viewport to A4 size @ 96dpi (approx) to ensure layout matches
        // A4 is 210mm x 297mm. 
        // In pixels at 96 DPI: 794 x 1123
        await page.setViewport({ width: 794, height: 1123 });

        // Basic HTML wrapper if needed, but setContent handles partials well if HEAD is missing.
        // However, adding a proper DOCTYPE and HTML structure helps.
        const fullHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    /* Basic Reset */
                    * { box-sizing: border-box; }
                    body { margin: 0; padding: 0; }
                    /* Injected CSS */
                    ${css || ''}
                </style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `;

        await page.setContent(fullHtml, {
            waitUntil: 'networkidle0', // Wait for fonts and images
            timeout: 30000
        });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 }
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
            'Content-Disposition': 'attachment; filename="resume.pdf"'
        });

        res.send(pdfBuffer);

    } catch (error) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ message: 'PDF generation failed', error: error.message });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};
