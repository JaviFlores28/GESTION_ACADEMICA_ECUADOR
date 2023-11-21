import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import pool from './sistema/Conexion/BaseDatos';
import { ColumnData } from './sistema/Interfaces/ColumnData';
import { MappedProperty } from './sistema/Interfaces/MappedProperty';
import Funciones from './sistema/Funciones/Funciones';

import * as dotenv from 'dotenv';

dotenv.config();
const { DB_DATABASE } = process.env;


//obtiene el tipo de mapeo a convertir
function getMappedType(fieldType: string | string[], propertyName: string) {
  if (fieldType.includes('tinyint')) {
    return 'number';
  } else if (fieldType.includes('char') || fieldType.includes('varchar') || fieldType.includes('enum')) {
    return 'string';
  } else if (fieldType.includes('date') || fieldType.includes('datetime')) {
    return `${propertyName === 'FECHA_CREACION' ? 'Date | undefined' : 'Date'}`;
  } else if (fieldType.includes('int') || fieldType.includes('float') || fieldType.includes('double') || fieldType.includes('decimal')) {
    return 'number';
  } else {
    return 'any';
  }
}

//mapea el tipo
function mapProperties(properties: ColumnData[]): MappedProperty[] {
  return properties.map((column: ColumnData) => {
    const fieldType = column.Type.toLowerCase();
    const propertyName = column.Field;
    const mappedType = getMappedType(fieldType, propertyName);
    const key = column.Key;

    return { name: propertyName, type: mappedType, key: key, type_old: fieldType };
  });
}

async function getTableInfo(connection: any, tableName: any) {
  const [results] = await connection.execute(`DESCRIBE ${tableName}`);
  return results;
}

async function getPrimaryKey(connection: any, tableName: any) {
  const [results] = await connection.execute(`SHOW KEYS FROM ${tableName} WHERE Key_name = 'PRIMARY'`);
  return results;
}

function generatePropsDefinitions(propertiesData: MappedProperty[]) {
  return propertiesData
    .filter((property) => property.name !== 'FECHA_CREACION')
    .map((property) => `${property.name}: ${property.type};`)
    .join('\n    ');
}

function generatePropsConstruct(propertiesData: MappedProperty[]) {
  return propertiesData
    .filter((property) => property.name !== 'FECHA_CREACION')
    .map((property) => {
      return `${property.name}: ${property.type}`;
    })
    .join(', ');
}

function generatePropsValues(propertiesData: MappedProperty[]) {
  return propertiesData
    .filter((property) => property.name !== 'FECHA_CREACION')
    .map((property) => {
      return `this.${property.name} = ${property.name};`;
    }).join('\n      ');
}

function generateFunctionToarray(propertiesData: MappedProperty[], tipo: string, tableName: string, ubicacion: string) {
  if (tipo === '1') {
    return propertiesData
      .filter((property) => property.name !== 'FECHA_CREACION')
      .map((property) => `${ubicacion}${property.name}`)
      .join(',');
  } else {
    const excludedProperties = (tableName !== 'usuario') ? ['FECHA_CREACION', 'CREADOR_ID'] : ['USUARIO', 'USR_PSWD', 'FECHA_CREACION'];
    return propertiesData
      .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
      .map((property) => `${ubicacion}${property.name}`)
      .join(',');
  }

}

function generatePropsIsValid(propertiesData: MappedProperty[]) {
  const excludedProperties = [
    'FECHA_CREACION',
    'ROL_PRF',
    'ROL_REPR',
    'ROL_ADMIN',
    'USUARIO',
    'USR_PSWD',
    'ESTADO'
  ];
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name))
    .map((property) => `!!this.${property.name}`)
    .join(' && ');
}

function generatePropsToArray(propertiesData: MappedProperty[], excludedProperties: string[]) {
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name))
    .map((property) => `'${property.name}'`)
    .join(',');
}

function generateObject(propertiesData: MappedProperty[], tableName: string, excludedProperties: string[]) {
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name))
    .map((property) => `${tableName}.${property.name}`)
    .join(', ');
}

function generateSqlInsert(propertiesData: MappedProperty[]) {
  const marcadores = propertiesData
    .filter((property) => property.name !== 'FECHA_CREACION')
    .map(() => '?').join(', ');
  const headers = propertiesData
    .filter((property) => property.name !== 'FECHA_CREACION')
    .map((property) => property.name).join(', ');
  return { headers, marcadores };
}

function generarSQLUpdate(propertiesData: MappedProperty[], tableName: string) {
  const excludedProperties = (tableName !== 'usuario') ? ['FECHA_CREACION', 'CREADOR_ID'] : ['USUARIO', 'USR_PSWD', 'FECHA_CREACION'];
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
    .map((property) => `${property.name}=?`).join(',');
}

async function generateEntityFile(connection: any, tableName: string, primaryKeyColumn: string) {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);
  const properties = await getTableInfo(connection, tableName);
  const propertiesData = mapProperties(properties);

  const isValid = `
isValid(): boolean {
  return ${generatePropsIsValid(propertiesData)};
}
`;

  const content = `
class ${capitalizedTableName}Entidad {
  ${generatePropsDefinitions(propertiesData)}    
    constructor(${generatePropsConstruct(propertiesData)}) {
       ${generatePropsValues(propertiesData)}
    }

    toArrayInsert(): any[] {
      return [${generateFunctionToarray(propertiesData, '1', tableName, 'this.')}];
    } 
    toArrayUpdate(): any[] {
      return [${generateFunctionToarray(propertiesData, '2', tableName, 'this.')}, this.${primaryKeyColumn}];
    }
}

export default ${capitalizedTableName}Entidad;
`;

  const carpetaEntidades = path.join(__dirname, 'Entidades');
  const archivoEntidad = path.join(carpetaEntidades, `${capitalizedTableName}Entidad.ts`);

  if (!existsSync(carpetaEntidades)) {
    mkdirSync(carpetaEntidades, { recursive: true });
  }

  writeFileSync(archivoEntidad, content, 'utf8');
}

async function generateDataFile(connection: any, tableName: string, primaryKeyColumn: string) {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);
  const properties = await getTableInfo(connection, tableName);
  const propertiesData = mapProperties(properties);

  const usuariodata = `usuario.USUARIO = Funciones.crearUsuario(usuario.USR_DNI, usuario.USR_NOM, usuario.USR_NOM2, usuario.USR_APE);
  usuario.USR_PSWD = Funciones.encrypt(usuario.USR_DNI);
  `;

  const stringByinsertUser = `else {
    if (detalle) {
      detalle.USR_ID = usuario.USR_ID;
      const response = await UsuarioProfesorDatos.insert(detalle);
      if (response.data === null) {
        await this.delete(usuario.USR_ID)
        throw new Error(response.message);
      }
    }
  }`;

  const functioninsert = `
  static async insert(${tableName}: ${capitalizedTableName}Entidad ${(tableName === 'usuario') ? ', detalle?: UsuarioProfesorEntidad' : ''}): Promise<Respuesta> {
    try {
      ${tableName}.${primaryKeyColumn} = uuidv4(); //asigna un identificador unico
      ${tableName === 'usuario' ? usuariodata : ''}
      const new${capitalizedTableName} = new ${capitalizedTableName}Entidad(${generateObject(propertiesData, tableName, ['FECHA_CREACION'])});

      let sql =this.sqlInsert;
      const [result] = await pool.execute<any>(sql, new${capitalizedTableName}.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar ${capitalizedTableName}');
      }${(tableName === 'usuario') ? stringByinsertUser : ''}
      return {response: true, data:new${capitalizedTableName}.${primaryKeyColumn}, message: 'Se creo correctamente' }; // Retorna el ID del ${capitalizedTableName}
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functionUpdate = `
  static async update(${tableName}: ${capitalizedTableName}Entidad): Promise<Respuesta> {
    try {
      const new${capitalizedTableName} = new ${capitalizedTableName}Entidad(${generateObject(propertiesData, tableName, ['FECHA_CREACION'])});
      let sql =this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, new${capitalizedTableName}.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar ${capitalizedTableName}');
      }
      return {response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functionDelete = `
  static async delete(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlDelete;
      const [result] = await pool.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo ${capitalizedTableName}');
      }
      return { response: true, data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const stringByGetUser = `
    const userMapping = {
      'R': ' WHERE ROL_REPR=1',
      'P': ' WHERE ROL_PRF=1',
      'A': ' WHERE ROL_ADMIN=1'
    }as { [key: string]: string };
    const userClause = userMapping[tipo] || '';
    sql += userClause;
    `;

  const functionGet = `
  static async getAll(${(tableName === 'usuario' ? 'tipo: string' : '')}): Promise<Respuesta> {
    try {
      let sql = this.sqlSelect;
      ${(tableName === 'usuario' ? stringByGetUser : '')}
      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as ${capitalizedTableName}Entidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functiongetById = `
  static async getById(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetById;
      const [rows] = await pool.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo ${capitalizedTableName} no encontrado');
      }
      let new${capitalizedTableName} = rows[0] as ${capitalizedTableName}Entidad;
      return {response: true, data: new${capitalizedTableName}, message: 'Encontrado' };
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functiongetByCurso = `
  static async getByCurso(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetMatriculas;
      const [rows] = await pool.execute<any>(sql, [id]);
      return { response: true, data: rows as ${capitalizedTableName}Entidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const stringByGetUserEnabled = `
  const userMapping = {
    'R': ' AND ROL_REPR=1',
    'P': ' AND ROL_PRF=1',
    'A': ' AND ROL_ADMIN=1'
  }as { [key: string]: string };
  const userClause = userMapping[tipo] || '';
  sql += userClause;
  `;

  const functionGetEnabled = `
  static async getEnabled(${(tableName === 'usuario' ? 'tipo: string' : '')}): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;
      ${(tableName === 'usuario' ? stringByGetUserEnabled : '')}
      const [rows] = await pool.execute<any>(sql);
      return {response: true, data: rows as ${capitalizedTableName}Entidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functionGetByUser = `
  static async getByUser(${tableName}: string, pswd: string): Promise<Respuesta> {
    try {
      let sql = this.sqlGetByUser;
      const [rows] = await pool.execute<any>(sql, [${tableName}]);

      if (rows.length <= 0) {
        throw new Error('${capitalizedTableName} no encontrado');
      }

      const pswdDecrypt = Funciones.decrypt(rows[0].USR_PSWD);

      if (!Funciones.pswdValid(pswdDecrypt, pswd)) {
        throw new Error('Contraseña incorrecta');
      }
      let new${capitalizedTableName} = rows[0] as ${capitalizedTableName}Entidad;
      new${capitalizedTableName}.USR_PSWD = 'pswd';
      return {response: true, data: new${capitalizedTableName}, message: '${capitalizedTableName} Valido' }
    } catch (error: any) {
      return { response: false, data: null, message: error.code } // Devuelve una Promise rechazada con el error
    }
  }`;

  const functionGetNoMatriculados = `
  static async getNoMatriculados(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetNoMatriculados;
      const [rows] = await pool.execute<any>(sql);
      return {response: true, data: rows as ${capitalizedTableName}Entidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functioninsertarMasivamente = `
  static async insertMasivo(data:any): Promise<Respuesta> {
    try {
      const arrayIds = data.arrayIds;
      const estado = 1;

      // Crear un array de valores para todos los registros utilizando map
      const valores = arrayIds.map((id: any) => [
        uuidv4(),
        id,
        ${generateObject(propertiesData, 'data', ['FECHA_CREACION', primaryKeyColumn, 'EST_ID', 'ESTADO', 'CREADOR_ID'])},
        estado,
        data.CREADOR_ID
      ]);      
      // Crear una cadena de marcadores de posición y una cadena de campos
      const placeholders = valores
        .map((fila: string | any[]) => \`(\${Array.from({ length: fila.length }, () => '?').join(',')})\`)
        .join(',');

      const campos = [${generatePropsToArray(propertiesData, ['FECHA_CREACION'])}].join(',');

      // Consulta SQL con la cláusula INSERT INTO y VALUES
      const sql = \`INSERT INTO ${tableName} (\${campos}) VALUES \${placeholders};\`;

      // Ejecutar la consulta con el array de valores
      const [result] = await pool.execute<any>(sql, valores.flat());

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudieron insertar las matrículas');
      }

      return {response: true, data: true, message: 'Matrículas insertadas correctamente' };
    } catch (error: any) {
      return {response: false, data: false, message: error.code };
    }
  }`;

  const functiondeleteMasivo = `
  static async deleteMasivo(ids: string[]): Promise<{ data: boolean, message: string }> {
    try {
      // Crear una cadena de marcadores de posición para la cantidad de IDs en el array
      const placeholders = ids.map(() => '?').join(',');

      // Consulta SQL con cláusula IN
      let sql = \`DELETE FROM matricula WHERE MTR_ID IN (\${placeholders})\`;

      // Ejecutar la consulta con el array de IDs
      const [result] = await pool.execute<any>(sql, ids);

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudieron eliminar las matrículas');
      }

      return { data: true, message: 'Matrículas eliminadas' };
    } catch (error: any) {
      return { data: false, message: error.code };
    }
  }`;

  const functionupdateEstado = `  
  static async updateEstado(ids: string[]): Promise<Respuesta> {
    try {
      // Crear una cadena de marcadores de posición para la cantidad de IDs en el array
      const placeholders = ids.map(() => '?').join(',');

      // Consulta SQL con cláusula IN y actualización del estado
      let sql = \`\${this.sqlUpdateEstado}(\${placeholders});\`;

      // Ejecutar la consulta con el array de valores
      const [result] = await pool.execute<any>(sql, ids);

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudo actualizar el estado');
      }

      return {response: true, data: true, message: 'Estado actualizado' };
    } catch (error: any) {
      return {response: false, data: null, message: error.code };
    }
  }`;

  const generarSQLinsert = generateSqlInsert(propertiesData);
  const generarSQLupdate = generarSQLUpdate(propertiesData, tableName);

  const validarVistaTabla = (tableName: string) => {
    return (tableName === 'estudiante' || tableName === 'usuario' || tableName === 'estudiante_curso') ? `vista_${tableName}` : tableName;
  }


  const sqlgetmatriculas = `static sqlGetMatriculas: string = 'SELECT E.*, ec.EST_CRS_ID FROM vista_estudiante E JOIN ESTUDIANTE_CURSO EC ON E.EST_ID = EC.EST_ID JOIN CURSO C ON EC.CRS_ID = C.CRS_ID WHERE EC.ESTADO = 1 AND C.CRS_ID = ?;'`;
  const sqlGetNoMatriculados = `static sqlGetNoMatriculados: string = 'SELECT a.* FROM vista_estudiante AS a WHERE NOT EXISTS ( SELECT 1 FROM estudiante_curso AS b WHERE b.EST_ID = a.EST_ID AND (b.ESTADO = 1 OR b.CRS_ID = (SELECT CRS_ID FROM curso ORDER BY CRS_ORDEN DESC LIMIT 1)) ) AND a.ESTADO = 1;'`

  const content = `${tableName === 'usuario' ? `import Funciones from '../sistema/Funciones/Funciones';\nimport UsuarioProfesorDatos from './UsuarioProfesorDatos';\nimport UsuarioProfesorEntidad from '../Entidades/UsuarioProfesorEntidad';` : ''}
import pool from '../sistema/Conexion/BaseDatos';
import { Respuesta } from '../sistema/Interfaces/Respuesta';
import ${capitalizedTableName}Entidad from '../Entidades/${capitalizedTableName}Entidad';
import { v4 as uuidv4 } from 'uuid';

class ${capitalizedTableName}Datos {
  static sqlInsert: string = \`INSERT INTO ${tableName} (${generarSQLinsert.headers})VALUES(${generarSQLinsert.marcadores});\`;
  static sqlUpdate: string = \`UPDATE ${tableName} SET ${generarSQLupdate} WHERE ${primaryKeyColumn}=?;\`;
  static sqlUpdateEstado: string = 'UPDATE ${tableName} SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  ${primaryKeyColumn} IN';
  static sqlDelete: string = \`DELETE FROM ${tableName} WHERE ${primaryKeyColumn} = ?\`;
  static sqlSelect: string = \`SELECT * FROM ${validarVistaTabla(tableName)} \`;
  static sqlGetById: string = 'SELECT * FROM ${tableName} WHERE ${primaryKeyColumn} = ?';
  static sqlGetEnabled: string = 'SELECT * FROM ${validarVistaTabla(tableName)} WHERE ESTADO = 1';
  ${(tableName === 'usuario') ? `static sqlGetByUser: string = 'SELECT * FROM ${tableName} WHERE USUARIO = ?'` :
      (tableName === 'estudiante_curso') ? sqlGetNoMatriculados + '\n' + sqlgetmatriculas : ''}
  ${functioninsert}
  ${functionUpdate}
  ${functionupdateEstado}
  ${functionDelete}
  ${functionGet}
  ${functiongetById}
  ${functionGetEnabled}
  ${(tableName === 'usuario') ? functionGetByUser : (tableName === 'estudiante_curso') ? functionGetNoMatriculados + functiongetByCurso + functioninsertarMasivamente : ''}


}
export default ${capitalizedTableName}Datos;
`;

  const carpetaEntidades = path.join(__dirname, 'Datos');
  const archivoEntidad = path.join(carpetaEntidades, `${capitalizedTableName}Datos.ts`);

  if (!existsSync(carpetaEntidades)) {
    mkdirSync(carpetaEntidades, { recursive: true });
  }

  writeFileSync(archivoEntidad, content, 'utf8');
}

async function generateNegocioFile(tableName: string) {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);

  const functionInsert = `
  static async insert(${tableName}: ${capitalizedTableName}Entidad ${(tableName === 'usuario') ? ', detalle?: UsuarioProfesorEntidad' : ''}): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.insert(${tableName} ${(tableName === 'usuario') ? ', detalle' : ''});
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functioninsertarMasivamente = `
  static async insertMasivo(data:any): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.insertMasivo(data);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;


  const functionUpdate = `
  static async update(${tableName}: ${capitalizedTableName}Entidad): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.update(${tableName});
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functionDelete = `
  static async delete(id: String): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functionGetAll = `
  static async getAll(${(tableName === 'usuario') ? `tipo: string` : ''}): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getAll(${(tableName === 'usuario') ? `tipo` : ''});
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functiongetById = `
  static async getById(id: String): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functiongetByCurso = `
  static async getByCurso(id: String): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getByCurso(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functionGetEnabled = `
  static async getEnabled(${(tableName === 'usuario') ? `tipo: string` : ''}): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getEnabled(${(tableName === 'usuario') ? `tipo` : ''});

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functionGetByUser = `
  static async getByUser(${tableName}: string, pswd: string): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getByUser(${tableName}, pswd);

    } catch (error: any) {
      return { response: false, data: null, message: error.code } // Devuelve una Promise rechazada con el error
    }
  }`;

  const functionGetNoMatriculados = `
  static async getNoMatriculados(): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getNoMatriculados();
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const functionupdateEstado = `
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; // Retorna el mensaje del error
    }
  }`;

  const content = `${(tableName === 'usuario') ? `import UsuarioProfesorEntidad from '../Entidades/UsuarioProfesorEntidad'; ` : ''}
import ${capitalizedTableName}Datos from '../Datos/${capitalizedTableName}Datos';
import ${capitalizedTableName}Entidad from '../Entidades/${capitalizedTableName}Entidad';
import { Respuesta } from '../sistema/Interfaces/Respuesta';

class ${capitalizedTableName}Negocio {
  ${functionInsert}
  ${functionUpdate}
  ${functionupdateEstado}
  ${functionDelete}
  ${functionGetAll}
  ${functionGetEnabled}
  ${functiongetById}
  ${(tableName === 'usuario') ? functionGetByUser : (tableName === 'estudiante_curso') ? functionGetNoMatriculados + functiongetByCurso + functioninsertarMasivamente : ''}
}

export default ${capitalizedTableName}Negocio;`;

  const carpeta = path.join(__dirname, 'Negocio');
  const archivo = path.join(carpeta, `${capitalizedTableName}Negocio.ts`);

  if (!existsSync(carpeta)) {
    mkdirSync(carpeta, { recursive: true });
  }
  writeFileSync(archivo, content, 'utf8');

}

async function generateServiceFile(tableName: any) {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);
  const lowercaseTableName = Funciones.stringToCamelCase(tableName);

  const estudiante_curso = `case 'noMatriculados':
    ${tableName} = await ${capitalizedTableName}Negocio.getNoMatriculados();
    break;
  case 'curso':
    ${tableName} = await ${capitalizedTableName}Negocio.getByCurso(id);
    break;`;

  const getroute = `
  router.get('/${lowercaseTableName}', async (req, res) => {
    try {
      let ${tableName};
      const by = req.query.by as string;
      if (!by) {
        return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
      }
      const id = req.query.id as string;
      ${(tableName === 'usuario') ? `  const tipo = req.query.tipo as string;` : ''}
      switch (by) {
        case 'all':
          ${tableName} = await ${capitalizedTableName}Negocio.getAll(${(tableName === 'usuario') ? `tipo` : ''});
          break;
        case 'enabled':
          ${tableName} = await ${capitalizedTableName}Negocio.getEnabled(${(tableName === 'usuario') ? `tipo` : ''});
          break;
        case 'id':
          ${tableName} = await ${capitalizedTableName}Negocio.getById(id);
          break;
          ${tableName === 'estudiante_curso' ? estudiante_curso : ''}
        default:
          return res.status(400).json({ message: 'Parámetro inválido en la consulta.' });
      }
      res.json(${tableName});
    } catch (error: any) {
      res.status(500).json({ message: error.code });
    }
  });
  `;

  const scriptUsuarioPost = `const { usuario, detalle } = req.body;
const response = await ${capitalizedTableName}Negocio.insert(usuario, detalle);
`;

  const scriptPost = `const ${tableName}: ${capitalizedTableName}Entidad = req.body;
const response = await ${capitalizedTableName}Negocio.insert(${tableName});`;

  const scriptPostMasivo = `const { masivo,type, data }: TypeRequest = req.body;
  let response;
  if(!masivo){
     response = await ${capitalizedTableName}Negocio.insert(data);
  }else{
    response = await ${capitalizedTableName}Negocio.insertMasivo(data);
  }
`;

  const postroute = `
router.post('/${lowercaseTableName}', async (req, res) => {
   try {
${(tableName === 'usuario') ? scriptUsuarioPost : (tableName === 'estudiante_curso') ? scriptPostMasivo : scriptPost}
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});`;

  const getByUser = `else if(!masivo && type === 'getByUser'){
   response = await ${capitalizedTableName}Negocio.getByUser(data.usuario,data.pswd);
}  `;

  const patchRoute = `
router.patch('/${lowercaseTableName}', async (req, res) => {
   try {
    const { masivo, type, data}: TypeRequest = req.body;
    let response;
    if(masivo && type === 'updateEstado'){
      response = await ${capitalizedTableName}Negocio.updateEstado(data);
    }else if(masivo && type === 'delete'){
      //response = await ${capitalizedTableName}Negocio.updateEstado(data);
    }${(tableName === 'usuario') ? getByUser : ''}
      
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});
`;

  const putroute = `
router.put('/${lowercaseTableName}', async (req, res) => {
  try {
    const  ${tableName}: ${capitalizedTableName}Entidad = req.body;
    const response = await ${capitalizedTableName}Negocio.update(${tableName});
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.code });
   }
});`;

  const deleteroute = `
router.delete('/${lowercaseTableName}', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await ${capitalizedTableName}Negocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.code });
  }
});`;



  const content = `
import { Router } from 'express';
const router = Router();
import ${capitalizedTableName}Negocio from '../Negocio/${capitalizedTableName}Negocio';
import ${capitalizedTableName}Entidad from '../Entidades/${capitalizedTableName}Entidad';
import { TypeRequest } from '../sistema/Interfaces/TypeRequest';
${postroute}
${putroute}
${patchRoute}
${deleteroute}
${getroute}
export default router;
`;
  const carpeta = path.join(__dirname, 'Servicios');
  const archivo = path.join(carpeta, `${capitalizedTableName}Servicio.ts`);

  if (!existsSync(carpeta)) {
    mkdirSync(carpeta, { recursive: true });
  }
  writeFileSync(archivo, content, 'utf8');
}

//no son parte del sistema
function generateFormReactive(propertiesData: MappedProperty[]) {
  const excludedProperties = ['USR_ID', 'USR_PSWD', 'FECHA_CREACION', 'CREADOR_ID'];
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
    .map((property) => {
      if (property.type === 'Date') {
        return `${property.name}: [getFormattedDate(new Date()),Validators.required]`
      } else if (property.type_old.includes('tinyint')) {
        return `${property.name}: [false,Validators.required]`
      } else if (property.type === 'number') {
        return `${property.name}: [0,Validators.required]`
      } else {
        return `${property.name}: ['',Validators.required]`
      }
    }
    )
    .join(',\n ');
}

function generateFormHTML(propertiesData: MappedProperty[]) {
  const excludedProperties = ['USR_ID', 'USR_PSWD', 'FECHA_CREACION', 'CREADOR_ID'];
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
    .map((property) => {
      if (property.type === 'Date') {
        return `<div class="col">
        <label for="${property.name}" class="form-label">${property.name}</label>
        <input type="date" id="${property.name}" formControlName="${property.name}" class="form-control">
    </div>`;
      } else if (property.type_old.includes('tinyint')) {
        return `  <div class="col">
        <label for="${property.name}" class="form-label pb-2">${property.name}</label>
        <div class="form-check form-switch">
            <input class="form-check-input" id="${property.name}" type="checkbox" role="switch"
                formControlName="${property.name}">
        </div>
    </div>`
      } else if (property.type === 'number') {
        return `<div class="col">
        <label for="${property.name}" class="form-label">${property.name}</label>
        <input type="numvber" id="${property.name}" formControlName="${property.name}" class="form-control">
    </div>`
      } else {
        return `<div class="col">
        <label for="${property.name}" class="form-label">${property.name}</label>
        <input type="text" id="${property.name}" formControlName="${property.name}" class="form-control">
    </div>`
      }
    }
    )
    .join('\n ');
}

function generateObjectComponet(propertiesData: MappedProperty[]) {
  const excludedProperties = ['USR_ID', 'USR_PSWD', 'FECHA_CREACION', 'CREADOR_ID', 'USUARIO', 'ROL_ADMIN', 'ROL_REPR', 'ROL_PRF'];
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
    .map((property) => {
      if (property.type === 'Date') {
        return `${property.name}:this.form.value.${property.name} ? new Date(this.form.value.${property.name}) : new Date()`
      } else if (property.type_old.includes('tinyint')) {
        return `${property.name}: (this.form.value.${property.name}) ? 1 : 0`
      } else if (property.type === 'number') {
        return `${property.name}:this.form.value.${property.name}|| 0`
      } else {
        return `${property.name}:this.form.value.${property.name}|| ''`
      }
    })
    .join(',\n ');
}

function generateFillFormReactive(propertiesData: MappedProperty[]) {
  const excludedProperties = ['USR_ID', 'USR_PSWD', 'FECHA_CREACION', 'CREADOR_ID', 'ROL_ADMIN', 'ROL_REPR', 'ROL_PRF'];
  return propertiesData
    .filter((property: { name: string; key: string }) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
    .map((property) => {
      if (property.type === 'Date') {
        return `this.form.get('${property.name}')?.setValue(getFormattedDate(data.${property.name}))`
      } else if (property.type_old.includes('tinyint')) {
        return `this.form.get('${property.name}')?.setValue((data.${property.name} === 1) ? true : false)`
      } else {
        return `this.form.get('${property.name}')?.setValue(data.${property.name})`
      }
    })
    .join(',\n ');
}

async function generateInterfaceFile(connection: any, tableName: string) {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);
  const properties = await getTableInfo(connection, tableName);
  const propertiesData = mapProperties(properties);

  const content = `export interface ${capitalizedTableName} {
  ${generatePropsDefinitions(propertiesData)}
}`;

  const carpeta = path.join(__dirname, 'interfaces');
  const archivo = path.join(carpeta, `${capitalizedTableName}.interface.ts`);

  if (!existsSync(carpeta)) {
    mkdirSync(carpeta, { recursive: true });
  }

  writeFileSync(archivo, content, 'utf8');

}

async function generateComponentFile(connection: any, tableName: any, primaryKeyColumn: string) {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);
  const lowercaseTableName = Funciones.stringToCamelCase(tableName);
  const properties = await getTableInfo(connection, tableName);
  const propertiesData = mapProperties(properties);

  const content = `
  
  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private usuarioService: UsuarioService, private service: ${capitalizedTableName}Service) { }

  modoEdicion: boolean = false;
  elementoId: string = '';
  icon = faInfoCircle;
 
  form = this.formBuilder.group({
    ${generateFormReactive(propertiesData)}
  })

  ngOnInit(): void {
    this.validarEdicion();    
  }


  validarEdicion() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.modoEdicion = true;
        this.elementoId = id;
        this.loadData();
      } else {
        this.modoEdicion = false;
        this.elementoId = '';
      }
    });
  }

  onSubmit() {
    this.openConfirmationModal();
  }

  crear() {
    if (this.form.valid) {
      const ${lowercaseTableName}: ${capitalizedTableName} = this.buildObject();
      this.service.post(${lowercaseTableName}).subscribe(
        {
          next: (response) => {
            this.handleResponse(response);
          },
          error: (error) => this.handleErrorResponse(error)
        }
      );
    } else {
      this.form.markAllAsTouched();
    }
  }


  editar() {
    if (this.form.valid) {
      const ${lowercaseTableName}: ${capitalizedTableName} = this.buildObjectEdit();

      this.service.put(${lowercaseTableName}).subscribe(
        {
          next: (response) => {
            this.handleResponse(response);
          },
          error: (error) => this.handleErrorResponse(error)
        }
      );

    } else {
      this.form.markAllAsTouched();
    }
  }

  handleResponse(response: any) {
    if (!response.data) {
      this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
      console.log(response.message);
    } else {
      if (this.modoEdicion) {
        this.openAlertModal(response.message, 'success');
        console.log(response.message);
      } else {
        this.openAlertModal(response.message, 'success');
        this.form.reset();
        this.router.navigate(['../editar/' + response.data], { relativeTo: this.route });
      }

    }
  }

  handleErrorResponse(error: any) {
    this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger');
    console.log(error);
  }

  buildObject() {
    const userId = this.usuarioService.getUserLoggedId();
    const ${lowercaseTableName}: ${capitalizedTableName} = {
      ${primaryKeyColumn}: '0',
      ${generateObjectComponet(propertiesData)},
      CREADOR_ID: userId || ''
     ${(tableName === 'usuario') ? ' ROL_PRF: 0,\nROL_REPR: 0,\nROL_ADMIN: 1,' : ''}
    };
    return ${lowercaseTableName};
  }

  buildObjectEdit() {
    const ${lowercaseTableName}: ${capitalizedTableName} = {
      ${primaryKeyColumn}: this.elementoId,
      ${generateObjectComponet(propertiesData)},
      CREADOR_ID: '0'
    };
    return ${lowercaseTableName};
  }

  loadData() {
    this.service.getById(this.elementoId).subscribe({
      next: (value) => {
        if (value.data) {
          this.llenarForm(value.data);
        } else {
          console.log(value.message);
        }
      },
      error: (error) => {
        console.log(error);
      }
    });
  }


llenarForm(data: ${capitalizedTableName}) {
  ${generateFillFormReactive(propertiesData)}
}

openAlertModal(content: string, alertType: string) {
  const modalRef = this.ngBootstrap.open(ModalComponent);
  modalRef.componentInstance.activeModal.update({ size: 'sm', centered: true });
  modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = content);
  modalRef.componentInstance.icon = (alertType == 'success') ? faCircleCheck : (alertType == 'danger') ? faCircleXmark : faInfoCircle;
  modalRef.componentInstance.color = alertType;
  modalRef.componentInstance.modal = false;
}

openConfirmationModal() {
  const modalRef = this.ngBootstrap.open(ModalComponent);
  modalRef.componentInstance.activeModal.update({ size: 'sm', centered: true });

  // Usa el operador Elvis para asegurarte de que activeModal y contenido estén definidos
  modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = (!this.modoEdicion) ? '¿Desea guardar?' : '¿Desea editar?');
  modalRef.componentInstance.icon = faInfoCircle;
  modalRef.componentInstance.color = 'warning';
  modalRef.result.then((result) => {
    if (result === 'save') {
      if (this.modoEdicion) {
        this.editar();
      } else {
        this.crear();
      }
    }
  }).catch((error) => {
    console.log(error);
  });
}
`;

  const carpeta = path.join(__dirname, 'Componentes');
  const archivo = path.join(carpeta, `${capitalizedTableName}.ts`);

  if (!existsSync(carpeta)) {
    mkdirSync(carpeta, { recursive: true });
  }
  writeFileSync(archivo, content, 'utf8');
}

async function generateHTMLFile(connection: any, tableName: any) {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);
  const lowercaseTableName = Funciones.stringToCamelCase(tableName);
  const properties = await getTableInfo(connection, tableName);
  const propertiesData = mapProperties(properties);

  const content = `${generateFormHTML(propertiesData)}`;
  const carpeta = path.join(__dirname, 'html');
  const archivo = path.join(carpeta, `${capitalizedTableName}.html`);

  if (!existsSync(carpeta)) {
    mkdirSync(carpeta, { recursive: true });
  }
  writeFileSync(archivo, content, 'utf8');
}

async function main() {
  try {
    const [tables] = await pool.execute<any>('SHOW FULL TABLES WHERE Table_type = "BASE TABLE"');


    for (const table of tables) {
      const tableName = table[`Tables_in_${DB_DATABASE}`];
      const primaryKeyResult = await getPrimaryKey(pool, tableName);
      let primaryKeyColumn = 'ID'; // Valor predeterminado

      if (primaryKeyResult && primaryKeyResult.length > 0) {
        primaryKeyColumn = primaryKeyResult[0].Column_name;
      }
      await generateDataFile(pool, tableName, primaryKeyColumn);
      await generateEntityFile(pool, tableName, primaryKeyColumn);
      await generateNegocioFile(tableName);
      await generateServiceFile(tableName);
      await generateInterfaceFile(pool, tableName);
      //await generateComponentFile(pool, tableName, primaryKeyColumn);
      //await generateHTMLFile(pool, tableName, primaryKeyColumn);
    }
    console.info('Archivos creados correctamente');
  } catch (error: any) {
    console.error('Error: ' + error.code);
  } finally {
    process.exit(); // Esto cerrará el programa después de que se complete la ejecución
  }
}

main();
