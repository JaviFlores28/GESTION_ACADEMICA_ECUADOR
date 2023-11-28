import BaseDatos from './sistema/conexion/BaseDatos';

async function main() {
  const baseDatos = new BaseDatos();
  baseDatos
    .createDatabase()
    .then(() => {
      baseDatos.defaultData();
    })
    .finally(() => {
      process.exit();
    });
}

main();
