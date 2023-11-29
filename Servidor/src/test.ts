import express from 'express';
import puppeteer from 'puppeteer';
const app = express();
const port = 3000;

app.get('/generate-pdf', async (req, res) => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

  // Lógica para generar el PDF
  await page.setContent(`
  <html>

  <head>
      <title>Ejemplo de PDF con Bootstrap</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
  </head>
  
  <body>
      <div class="container-fluid m-3">
      <div class="table-responsive">
          <table class="table-sm table-bordered text-center">
              <thead class="align-middle">
                  <tr>
                      <th rowspan="2">#</th>
                      <th rowspan="2">Cédula</th>
                      <th rowspan="2">Nombres</th>
                      <th colspan="8">Periodo 1</th>
                      <th colspan="8">Periodo 2</th>
                      <th colspan="8">Periodo 3</th>
                  </tr>
                  <tr>
                      <th>P1</th>
                      <th>P2</th>
                      <th>PROM</th>
                      <th>80%</th>
                      <th>Ex</th>
                      <th>20%</th>
                      <th>Total</th>
                      <th>EC</th>
                      <th>P1</th>
                      <th>P2</th>
                      <th>PROM</th>
                      <th>80%</th>
                      <th>Ex</th>
                      <th>20%</th>
                      <th>Total</th>
                      <th>EC</th>
                      <th>P1</th>
                      <th>P2</th>
                      <th>PROM</th>
                      <th>80%</th>
                      <th>Ex</th>
                      <th>20%</th>
                      <th>Total</th>
                      <th>EC</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <th scope="row">1</th>
                      <td>12345456678</td>
                      <td>Mark</td>
                      <td>3</td>
                      <td>6</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                      <td>7</td>
                  </tr>
              </tbody>
          </table>
      </div>
      </div>

  </body>
  
  </html>
  `);

  const pdfBuffer = await page.pdf({ format: 'A4',landscape: true  });

  await browser.close();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=example.pdf');
  res.send(pdfBuffer);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
