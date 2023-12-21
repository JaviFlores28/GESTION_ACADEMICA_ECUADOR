import 'dotenv/config';
import BaseDatos from '../src/sistema/conexion/BaseDatos';
import { appendFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

async function generaarTriggers(tableName: string) {
    const properties = await BaseDatos.getTableInfo(tableName);
    const fields = BaseDatos.mapProperties(properties);
    const generateAuditProcedureCode = (action: string) => {
        const procedureName = `${action}_${tableName.toUpperCase()}`;
        let code = `DELIMITER //\n\nCREATE PROCEDURE ${procedureName}(\n`;

        // Generate parameters based on the fields in the table
        fields.forEach((field) => {
            code += `    IN p_${field.name} ${field.type_old},\n`;
        });

        code += `    IN p_USER_ID CHAR(36)\n`;
        code += ')\nBEGIN\n';

        // Perform the operation based on the action type
        if (action === 'INSERT') {
            code += `    -- Realizar la inserción en la tabla ${tableName}\n`;
            code += `    INSERT INTO ${tableName} (${fields.map(field => field.name).join(', ')})\n`;
            code += `    VALUES (${fields.map(field => `p_${field.name}`).join(', ')});\n`;
        } else if (action === 'UPDATE') {
            code += `    -- Realizar la actualización en la tabla ${tableName}\n`;
            code += `    UPDATE ${tableName}\n`;
            code += `    SET ${fields.map(field => `${field.name} = p_${field.name}`).join(', ')}\n`;
            code += `    WHERE ${fields[0].name} = p_${fields[0].name};\n`;
        } else if (action === 'DELETE') {
            code += `    -- Obtener datos del ${tableName} antes de eliminar\n`;
            code += `    SELECT ${fields.map(field => `${field.name}`).join(', ')}\n`;
            code += `    INTO ${fields.map(field => `@${field.name}`).join(', ')}\n`;
            code += `    FROM ${tableName}\n`;
            code += `    WHERE ${fields[0].name} = p_${fields[0].name};\n\n`;
            code += `    -- Realizar la eliminación en la tabla ${tableName}\n`;
            code += `    DELETE FROM ${tableName} WHERE ${fields[0].name} = p_${fields[0].name};\n`;
        }

        // Insert audit record
        code += `    -- Insertar el registro en la tabla auditora\n`;
        code += `    INSERT INTO AUDIT_${tableName.toUpperCase()} (AUDIT_DATE, AUDIT_OPERATION, USER_ID, ${fields.map(field => field.name).join(', ')})\n`;
        code += `    VALUES (CURRENT_TIMESTAMP, '${action}', p_USER_ID, ${fields.map(field => `p_${field.name}`).join(', ')});\n`;
        code += 'END //\n\nDELIMITER ;\n\n';

        return code;
    };

    const insertTriggerCode = generateAuditProcedureCode('INSERT');
    const updateTriggerCode = generateAuditProcedureCode('UPDATE');
    const deleteTriggerCode = generateAuditProcedureCode('DELETE');

    const carpeta = path.join(__dirname, '../test/procedures/');
    const content = insertTriggerCode + updateTriggerCode + deleteTriggerCode;
    const archivo = path.join(carpeta, `PROCEDURES.SQL`);

    if (!existsSync(carpeta)) {
        mkdirSync(carpeta, { recursive: true });
    }
    appendFileSync(archivo, content, 'utf8');
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

async function consultas() {

    const pool = await BaseDatos.getInstanceDataBase();
    /* const nuevoCurso = [
        '12',
        'nombre',
        'BGU',
        1,
        1,
        '05534948-c491-4559-9719-9643cadcdd34'
    ];

    // Realizar la inserción y obtener el CRS_ID generado
    const [result] = await pool.execute<any>('CALL InsertarCurso2ConAuditoria(?,?,?,?,?,?);', nuevoCurso);
    console.log(result); */

    // Datos para la actualización de un curso existente
    const cursoActualizado = [
        '12',
        '05534948-c491-4559-9719-9643cadcdd34'
      ];
  
      // Realizar la actualización
      const [resultActualizacion] = await pool.execute<any>('CALL EliminarCurso2ConAuditoria(?,?);', cursoActualizado);
  
      console.log(resultActualizacion);
}

generateAll();

 // Obtener el UUID del último curso insertado
    /*  const [rows] = await pool.query<any>('SELECT CRS_ID FROM CURSO2 WHERE CRS_ID = ?', [result.insertId]);
     const nuevoCRS_ID = rows[0].CRS_ID;
 
     console.log(`CRS_ID del nuevo curso: ${nuevoCRS_ID}`); */