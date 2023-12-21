const fs = require('fs');
const readline = require('readline');

function eliminarCreadorId(inputFilePath: string, outputFilePath: string) {
  const inputStream = fs.createReadStream(inputFilePath);
  const outputStream = fs.createWriteStream(outputFilePath);

  const rl = readline.createInterface({
    input: inputStream,
    output: outputStream,
    terminal: false
  });

  rl.on('line', (line: string) => {
    // Utilizamos una expresión regular para eliminar CREADOR_ID y su valor
    const modifiedLine = line.replace(/\bCREADOR_ID\s*=\s*'[a-f0-9-]+'\s*,?\s*/g, '');
    outputStream.write(modifiedLine + '\n');
  });

  rl.on('close', () => {
    console.log('Proceso completado. Archivo modificado guardado en', outputFilePath);
    outputStream.end();
  });
}

// Uso de la función
const inputFilePath = 'SQL/DATOS_TEST.sql';
const outputFilePath = 'test/PROCEDURE.sql';
eliminarCreadorId(inputFilePath, outputFilePath);
