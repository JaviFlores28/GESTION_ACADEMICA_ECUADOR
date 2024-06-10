import { Router } from 'express';
import puppeteer from 'puppeteer';
import BaseDatos from '../sistema/conexion/BaseDatos';

const router = Router();

router.post('/generarpdf', async (req, res) => {
  let browser;

  try {
    const { data, html } = req.body;

    // Validar y sanitizar el HTML si es necesario
    let html2 = await obtenerHTML(data);
    console.log(html2);
    
    const contenido = `
            <html>
            <head>
                <title>Reportes</title>
              
            </head>
            <body>
            ${(html) ? html : html2}
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

async function obtenerHTML(data: any) {
  //promocion
  if (data.tipo === 'promocion') {
    const pool = await BaseDatos.getInstanceDataBase();
    const consultaProfesorAsignaturaParalelo = 'SELECT * FROM profesor_asignatura_paralelo WHERE AL_ID=? AND CRS_ID=? AND `PRLL_ID` = ?';
    const [rows] = await pool.execute<any>(consultaProfesorAsignaturaParalelo, [data.AL_ID, data.CRS_ID, data.PRLL_ID]);

    if (rows.length <= 0) {
      throw new Error('No se encontró el objeto de tipo profesor');
    }

    const prfAsgPrllIds = rows.map((element: { PRF_ASG_PRLL_ID: any }) => element.PRF_ASG_PRLL_ID);
    const prfAsgPrllIdsStr = prfAsgPrllIds.map((id: any) => `"${id}"`).join(',');

    const consultaCalificaciones = `SELECT a.PRF_ASG_PRLL_ID, c.AREA_NOM, b.ASG_NOM, ROUND(AVG(a.CALIFICACION), 2) AS PROMEDIO_CALIFICACIONES FROM calificaciones_cuantitativas AS a JOIN profesor_asignatura_paralelo AS pa ON a.PRF_ASG_PRLL_ID = pa.PRF_ASG_PRLL_ID JOIN asignatura AS b ON pa.ASG_ID = b.ASG_ID JOIN area AS c ON b.AREA_ID = c.AREA_ID WHERE a.EST_CRS_PRLL_ID = '${data.EST_CRS_PRLL_ID}' AND a.PRF_ASG_PRLL_ID IN (${prfAsgPrllIdsStr}) GROUP BY a.PRF_ASG_PRLL_ID, b.ASG_NOM, c.AREA_NOM;    `;
    const [rows2] = await pool.execute<any>(consultaCalificaciones);

    if (rows2.length <= 0) {
      throw new Error('No se encontró el objeto de tipo Area');
    }

    let filasHTML = '';

    rows2.forEach((row: { AREA_NOM: any; ASG_NOM: any; PROMEDIO_CALIFICACIONES: any; }, index: number) => {
      filasHTML += `
        <tr>
          <th  style="border-color: black; border-style: solid; border-width: 1px; font-family: Arial, sans-serif; overflow: hidden; word-break: normal; text-align: center;" scope="row">${index + 1}</th>
          <td  style="border-color: black; border-style: solid; border-width: 1px; font-family: Arial, sans-serif; overflow: hidden; word-break: normal; text-align: center;">${row.AREA_NOM}</td>
          <td  style="border-color: black; border-style: solid; border-width: 1px; font-family: Arial, sans-serif; overflow: hidden; word-break: normal; text-align: center;">${row.ASG_NOM}</td>
          <td  style="border-color: black; border-style: solid; border-width: 1px; font-family: Arial, sans-serif; overflow: hidden; word-break: normal; text-align: center;">${row.PROMEDIO_CALIFICACIONES}</td>
        </tr>`;
    });

    const tablaHTML = `
    <table style="font-size: 0.7rem; width: 100%; border-spacing: 0; border-collapse: collapse;">
    <thead>
      <tr>
        <th scope="col" style="border-color: black; border-style: solid; border-width: 1px; font-family: Arial, sans-serif; overflow: hidden; word-break: normal; text-align: center; background-color: #C0C0C0;">#</th>
        <th scope="col" style="border-color: black; border-style: solid; border-width: 1px; font-family: Arial, sans-serif; overflow: hidden; word-break: normal; text-align: center; background-color: #C0C0C0;">Área</th>
        <th scope="col" style="border-color: black; border-style: solid; border-width: 1px; font-family: Arial, sans-serif; overflow: hidden; word-break: normal; text-align: center; background-color: #C0C0C0;">Asignatura</th>
        <th scope="col" style="border-color: black; border-style: solid; border-width: 1px; font-family: Arial, sans-serif; overflow: hidden; word-break: normal; text-align: center; background-color: #C0C0C0;">Promedio Calificaciones</th>
      </tr>
    </thead>
    <tbody>
      ${filasHTML}
    </tbody>
  </table>
    `;

    return tablaHTML;
  }
}

export default router;
