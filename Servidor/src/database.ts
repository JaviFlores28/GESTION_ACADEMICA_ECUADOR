import BaseDatos from './sistema/conexion/BaseDatos';

async function main() {
  BaseDatos.createDatabase();
  BaseDatos.defaultData().finally(() => {
    process.exit();
  });
}

main();
