import BaseDatos from './sistema/conexion/BaseDatos';

async function main() {
  await BaseDatos.createDatabase();
  await BaseDatos.defaultData().finally(() => process.exit());
}

main();
