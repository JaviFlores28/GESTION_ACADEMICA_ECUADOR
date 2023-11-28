import BaseDatos from './sistema/conexion/BaseDatos';

async function main() {
  BaseDatos.createDatabase()
    .then(() => {
      BaseDatos.defaultData();
    })
    .finally(() => {
      process.exit();
    });
}

main();
