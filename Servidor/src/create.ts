import { execSync } from 'child_process';
import DataCreator from './sistema/Creador/DataCreator';
import BaseDatos from './sistema/conexion/BaseDatos';
import Funciones from './sistema/funciones/Funciones';
import 'dotenv/config';
import ServicesCreator from './sistema/Creador/ServicesCreator';
import EntityCreator from './sistema/Creador/EntityCreator';
import BusinessCreator from './sistema/Creador/BusinessCreator';

async function main() {
  try {
    const baseDatos = new BaseDatos();
    const pool = await baseDatos.getPool();
    const [tables] = await pool.execute<any>('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
    for (const table of tables) {
      const tableName = table[`Tables_in_${process.env.DB_DATABASE}`];
      const properties = await Funciones.getTableInfo(pool, tableName);
      const propertiesData = Funciones.mapProperties(properties);

      const entityCreator = new EntityCreator(tableName, propertiesData);
      const dataCreator = new DataCreator(tableName, propertiesData);
      const businessCreator = new BusinessCreator(tableName);
      const servicesCreator = new ServicesCreator(tableName);

      await entityCreator.generateEntityFile();
      await dataCreator.generateDataFile();
      await businessCreator.generateBusinessFile();
      await servicesCreator.generateServiceFile();
    }
    
    execSync(`npx prettier src/ --write --print-width 1000 --single-quote`);
    console.info('Archivos creados correctamente');

  } catch (error: any) {
    console.error('Error: ' + error);
  } finally {
    process.exit();
  }
}
main();
