import { Router } from 'express';
import puppeteer from 'puppeteer';

const router = Router();

router.post('/generarpdf', async (req, res) => {
  let browser;

  try {
    const { tipo,data, html } = req.body;

    // Validar y sanitizar el HTML si es necesario
    obtenerHTML(tipo,data);
    const contenido = `
            <html>
            <head>
                <title>Ejemplo de PDF con Bootstrap</title>
              
            </head>
            <body>
            ${html}
            </body>
            </html>
        `;

    browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    try {
      // Lógica para generar el PDF
      await page.setContent(contenido);

      const pdfBuffer = await page.pdf({ format: 'A4', landscape: true, printBackground: true, margin: { top: '1cm', bottom: '1cm', left: '1cm', right: '1cm' } });

      // Configuración para descargar el archivo
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
      res.setHeader('Content-Length', pdfBuffer.length);
      res.send(pdfBuffer);
    } finally {
      // Asegurarse de cerrar el navegador incluso en caso de errores
      if (browser) await browser.close();
    }
  } catch (error: any) {
    // Loguear o registrar el error para depuración
    console.error(error);
    res.status(500).json({ message: 'Error al generar el PDF' });
  }
});


function obtenerHTML(tipo: string, data: any) {
  throw new Error('Function not implemented.');
}

export default router;
