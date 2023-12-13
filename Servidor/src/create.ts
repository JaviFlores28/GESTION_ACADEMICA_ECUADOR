import { execSync } from 'child_process';
import DataCreator from './sistema/Creador/DataCreator';
import BaseDatos from './sistema/conexion/BaseDatos';
import 'dotenv/config';
import ServicesCreator from './sistema/Creador/ServicesCreator';
import EntityCreator from './sistema/Creador/EntityCreator';
import BusinessCreator from './sistema/Creador/BusinessCreator';
import InterfaceCreator from './sistema/Creador/InterfaceCreator';

async function generateFilesForTable(tableName: string) {
  const properties = await BaseDatos.getTableInfo(tableName);
  const propertiesData = BaseDatos.mapProperties(properties);

  const entityCreator = new EntityCreator(tableName, propertiesData);
  const interfaceCreator = new InterfaceCreator(tableName, propertiesData);
  const dataCreator = new DataCreator(tableName, propertiesData);
  const businessCreator = new BusinessCreator(tableName);
  const servicesCreator = new ServicesCreator(tableName);

  await interfaceCreator.generateInterfaceFile();
  await entityCreator.generateEntityFile();
  await dataCreator.generateDataFile();
  await businessCreator.generateBusinessFile();
  await servicesCreator.generateServiceFile();
}

async function generateAll() {
  try {
    const pool = await BaseDatos.getInstanceDataBase();
    const [tables] = await pool.execute<any>('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
    for (const table of tables) {
      const tableName = table[`Tables_in_${process.env.DB_DATABASE}`];
      await generateFilesForTable(tableName);
    }
    // execSync(`npx prettier src/ --write --print-width 1000 --single-quote`);
    console.info('Archivos creados correctamente');
  } catch (error: any) {
    console.error('Error: ' + error);
  } finally {
    process.exit();
  }
}

async function generateOne(tableName: string) {
  try {
    await generateFilesForTable(tableName);
    execSync(`npx prettier src/ --write --print-width 1000 --single-quote`);
    console.info('Archivos creados correctamente');
  } catch (error: any) {
    console.error('Error: ' + error);
  } finally {
    process.exit();
  }
}

generateOne('escalas_referenciales_calificaciones');
