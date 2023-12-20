import 'dotenv/config';
import BaseDatos from '../src/sistema/conexion/BaseDatos';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';

async function generaarTriggers(tableName: string) {

    const properties = await BaseDatos.getTableInfo('usuario');
    const fields = BaseDatos.mapProperties(properties);

    const generateAuditTriggerCode = (action: string) => {
        return `

  DELIMITER //
  CREATE TRIGGER usuario_${action.toLowerCase()}
  AFTER ${action} ON ${tableName}
  FOR EACH ROW
  BEGIN
    ${action === 'INSERT' || action === 'DELETE' ?
                `INSERT INTO AUDITORIA_USUARIO (AUDIT_ID, USR_ID, ACCION, FECHA_MODIFICACION)
      VALUES (UUID(), ${action === 'INSERT' ? 'NEW' : 'OLD'}.USR_ID, '${action}', current_timestamp());` :
                fields
                    .map(
                        field => `  IF NEW.${field.name} != OLD.${field.name} THEN
      INSERT INTO AUDITORIA_USUARIO (AUDIT_ID, USR_ID, ACCION, CAMPO_MODIFICADO, VALOR_ANTIGUO, VALOR_NUEVO, FECHA_MODIFICACION)
      VALUES (UUID(), NEW.USR_ID, 'UPDATE', '${field.name}', OLD.${field.name}, NEW.${field.name}, current_timestamp());
    END IF;`
                    )
                    .join('\n\n')}
  END;
  //
  DELIMITER ;
  `;
    };

    const insertTriggerCode = generateAuditTriggerCode('INSERT');
    const updateTriggerCode = generateAuditTriggerCode('UPDATE');
    const deleteTriggerCode = generateAuditTriggerCode('DELETE');
    const carpeta = path.join(__dirname, '../../triggers');
    const content = insertTriggerCode + updateTriggerCode + deleteTriggerCode;
    const archivo = path.join(carpeta, `${tableName}.SQL`);

    if (!existsSync(carpeta)) {
        mkdirSync(carpeta, { recursive: true });
    }
    writeFileSync(archivo, content, 'utf8');
}


async function generateAll() {
    try {
        const pool = await BaseDatos.getInstanceDataBase();
        const [tables] = await pool.execute<any>('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');
        for (const table of tables) {
            const tableName = table[`Tables_in_${process.env.DB_DATABASE}`];
            await generaarTriggers(tableName);
        }
        // execSync(`npx prettier src/ --write --print-width 1000 --single-quote`);
        console.info('Archivos creados correctamente');
    } catch (error: any) {
        console.error('Error: ' + error);
    } finally {
        process.exit();
    }
}

generateAll();