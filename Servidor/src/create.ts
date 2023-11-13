import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import pool from './System/Conexion/BaseDatos';
import { ColumnData } from './System/Interfaces/ColumnData';
import { MappedProperty } from './System/Interfaces/MappedProperty';
import Funciones from './System/Funciones/Funciones';

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

function generateFunctionToarray(propertiesData: MappedProperty[], tipo: string, tableName: string) {
  if (tipo === '1') {
    return propertiesData
      .filter((property) => property.name !== 'FECHA_CREACION')
      .map((property) => `this.${property.name}`)
      .join(',');
  } else {
    const excludedProperties = (tableName !== 'usuario') ? ['FECHA_CREACION', 'CREADOR_ID'] : ['USUARIO', 'USR_PSWD', 'FECHA_CREACION'];
    return propertiesData
      .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
      .map((property) => `this.${property.name}`)
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

function generateObject(propertiesData: MappedProperty[], tableName: string) {
  const excludedProperties = ['FECHA_CREACION'];
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
      return [${generateFunctionToarray(propertiesData, '1', tableName)}];
    } 
    toArrayUpdate(): any[] {
      return [${generateFunctionToarray(propertiesData, '2', tableName)}, this.${primaryKeyColumn}];
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
  usuario.USR_PSWD = Funciones.encrypt(usuario.USR_PSWD);
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
      const new${capitalizedTableName} = new ${capitalizedTableName}Entidad(${generateObject(propertiesData, tableName)});

      let sql =this.sqlInsert;
      const [result] = await pool.execute<any>(sql, new${capitalizedTableName}.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar ${capitalizedTableName}');
      }${(tableName === 'usuario') ? stringByinsertUser : ''}
      return {response: true, data:new${capitalizedTableName}.${primaryKeyColumn}, message: 'Se creo correctamente' }; // Retorna el ID del ${capitalizedTableName}
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionUpdate = `
  static async update(${tableName}: ${capitalizedTableName}Entidad): Promise<Respuesta> {
    try {
      const new${capitalizedTableName} = new ${capitalizedTableName}Entidad(${generateObject(propertiesData, tableName)});
      let sql =this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, new${capitalizedTableName}.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar ${capitalizedTableName}');
      }
      return {response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
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
      return { response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const stringByGetUser = `if (tipo === 'R') {
    sql += ' where ROL_REPR=1'; // Added a space before AND
  } else if (tipo === 'P') {
    sql += ' where ROL_PRF=1';
  } else if (tipo === 'A') {
    sql += ' where ROL_ADMIN=1';
  } `;

  const functionGet = `
  static async getAll(${(tableName === 'usuario' ? 'tipo: string' : '')}): Promise<Respuesta> {
    try {
      let sql = this.sqlSelect;
      ${(tableName === 'usuario' ? stringByGetUser : '')}
      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as ${capitalizedTableName}Entidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.message }; // Retorna el mensaje del error
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
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const stringByGetUserEnabled = `if (tipo === 'R') {
    sql += ' AND ROL_REPR=1'; // Added a space before AND
  } else if (tipo === 'P') {
    sql += ' AND ROL_PRF=1';
  } else if (tipo === 'A') {
    sql += ' AND ROL_ADMIN=1';
  }`;

  const functionGetEnabled = `
  static async getEnabled(${(tableName === 'usuario' ? 'tipo: string' : '')}): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;
      ${(tableName === 'usuario' ? stringByGetUserEnabled : '')}

      const [rows] = await pool.execute<any>(sql);
      return {response: true, data: rows as ${capitalizedTableName}Entidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
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
      return { response: false, data: null, message: error.message } // Devuelve una Promise rechazada con el error
    }
  }`;

  const functioninsertarMasivamente = `
  static async  insertMasivo(matriculas: any): Promise<{ data: boolean, message: string }> {
    try {
      const creador_id = matriculas.usuario;
      const curso_id = matriculas.curso;
      const estudiantes = matriculas.estudiantes;
      const pase = '4';
      const estado = 1;

      // Crear un array de valores para todos los registros utilizando map
      const valores = estudiantes.map((estudiante_id: any) => [
        uuidv4(),  // MTR_ID
        curso_id,  // CRS_ID
        estudiante_id,  // EST_ID
        estado,  // ESTADO
        pase,  // PASE
        creador_id  // CREADOR_ID
      ]);

      console.log(valores);
      
      // Crear una cadena de marcadores de posición y una cadena de campos
      const placeholders = valores.map(() => '(?, ?, ?, ?, ?, ?)').join(',');
      const campos = ['MTR_ID', 'CRS_ID', 'EST_ID', 'ESTADO', 'PASE', 'CREADOR_ID'].join(',');

      // Consulta SQL con la cláusula INSERT INTO y VALUES
      const sql = \`INSERT INTO matricula (\${campos}) VALUES \${placeholders};\`;

      // Ejecutar la consulta con el array de valores
      const [result] = await pool.execute<any>(sql, valores.flat());

      // Verificar si se afectaron filas
      if (result.affectedRows < 1) {
        throw new Error('No se pudieron insertar las matrículas');
      }

      return { data: true, message: 'Matrículas insertadas correctamente' };
    } catch (error: any) {
      return { data: false, message: error.message };
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
      return { data: false, message: error.message };
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
      return {response: false, data: null, message: error.message };
    }
  }`;

  const generarSQLinsert = generateSqlInsert(propertiesData);
  const generarSQLupdate = generarSQLUpdate(propertiesData, tableName);

  const content = `${tableName === 'usuario' ? `import Funciones from '../System/Funciones/Funciones';\nimport UsuarioProfesorDatos from './UsuarioProfesorDatos';\nimport UsuarioProfesorEntidad from '../Entidades/UsuarioProfesorEntidad';` : ''}
import pool from '../System/Conexion/BaseDatos';
import { Respuesta } from '../System/Interfaces/Respuesta';
import ${capitalizedTableName}Entidad from '../Entidades/${capitalizedTableName}Entidad';
import { v4 as uuidv4 } from 'uuid';

class ${capitalizedTableName}Datos {

  static sqlInsert: string = \`INSERT INTO ${tableName} (${generarSQLinsert.headers})VALUES(${generarSQLinsert.marcadores});\`;
  static sqlUpdate: string = \`UPDATE ${tableName} SET ${generarSQLupdate} WHERE ${primaryKeyColumn}=?;\`;
  static sqlUpdateEstado: string = 'UPDATE ${tableName} SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  ${primaryKeyColumn} IN';
  static sqlDelete: string = \`DELETE FROM ${tableName} WHERE ${primaryKeyColumn} = ?\`;
  static sqlSelect: string = \`SELECT * FROM ${tableName}\`;
  static sqlGetById: string = 'SELECT * FROM ${tableName} WHERE ${primaryKeyColumn} = ?';
  static sqlGetEnabled: string = 'SELECT * FROM ${tableName} WHERE ESTADO = 1';
  ${(tableName === 'usuario') ? `static sqlGetByUser: string = 'SELECT * FROM ${tableName} WHERE USUARIO = ?';` : ''}
  ${functioninsert}
  ${functionUpdate}
  ${functionupdateEstado}
  ${functionDelete}
  ${functionGet}
  ${functiongetById}
  ${functionGetEnabled}
  ${(tableName === 'usuario') ? functionGetByUser : ''}


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
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionUpdate = `
  static async update(${tableName}: ${capitalizedTableName}Entidad): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.update(${tableName});
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionDelete = `
  static async delete(id: String): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionGetAll = `
  static async getAll(${(tableName === 'usuario') ? `tipo: string` : ''}): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getAll(${(tableName === 'usuario') ? `tipo` : ''});
    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functiongetById = `
  static async getById(id: String): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getById(id);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionGetEnabled = `
  static async getEnabled(${(tableName === 'usuario') ? `tipo: string` : ''}): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getEnabled(${(tableName === 'usuario') ? `tipo` : ''});

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionGetByUser = `
  static async getByUser(${tableName}: string, pswd: string): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getByUser(${tableName}, pswd);

    } catch (error: any) {
      return { response: false, data: null, message: error.message } // Devuelve una Promise rechazada con el error
    }
  }`;

  const functionupdateEstado = `
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  // ${(tableName === 'usuario') ? functionUpdatePswdUser + '\n' + validar + '\n' + functionPswdValid : ''}

  const content = `${(tableName === 'usuario') ? `import UsuarioProfesorEntidad from '../Entidades/UsuarioProfesorEntidad'; ` : ''}
import ${capitalizedTableName}Datos from '../Datos/${capitalizedTableName}Datos';
import ${capitalizedTableName}Entidad from '../Entidades/${capitalizedTableName}Entidad';
import { Respuesta } from '../System/Interfaces/Respuesta';

class ${capitalizedTableName}Negocio {
  ${functionInsert}
  ${functionUpdate}
  ${functionupdateEstado}
  ${functionDelete}
  ${functionGetAll}
  ${functionGetEnabled}
  ${functiongetById}
  ${(tableName === 'usuario' ? functionGetByUser : '')}
}

export default ${capitalizedTableName}Negocio;`;

  const carpeta = path.join(__dirname, 'Negocio');
  const archivo = path.join(carpeta, `${capitalizedTableName}Negocio.ts`);

  if (!existsSync(carpeta)) {
    mkdirSync(carpeta, { recursive: true });
  }
  writeFileSync(archivo, content, 'utf8');

}

async function generateServiceFile(connection: any, tableName: any) {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);
  const lowercaseTableName = Funciones.stringToCamelCase(tableName);

  const getroute = `
router.get('/${lowercaseTableName}', async (req, res) => {
   try {
    let  ${tableName};
    const by = req.query.by as string;
    if (!by) {
      return res.status(400).json({ message: 'Faltan parámetros en la consulta.' });
    }
    if (by === 'all') {
      ${(tableName === 'usuario') ? ` const tipo = req.query.tipo as string;` : ''}
      ${tableName} = await ${capitalizedTableName}Negocio.getAll(${(tableName === 'usuario') ? `tipo` : ''});
    } else if (by === 'enabled') {
      ${(tableName === 'usuario') ? `  const tipo = req.query.tipo as string;` : ''}
      ${tableName} = await ${capitalizedTableName}Negocio.getEnabled(${(tableName === 'usuario') ? `tipo` : ''});
    } else if (by === 'id') {
      const id = req.query.id as string;
      ${tableName} = await ${capitalizedTableName}Negocio.getById(id);
    } 
    res.json(${tableName});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});`;

  const scriptUsuariopost = `const { usuario, detalle } = req.body;
const response = await ${capitalizedTableName}Negocio.insert(usuario, detalle);
`;
const scriptpost=`const ${tableName}: ${capitalizedTableName}Entidad = req.body;
const response = await ${capitalizedTableName}Negocio.insert(${tableName});`;

  const postroute = `
router.post('/${lowercaseTableName}', async (req, res) => {
   try {
${(tableName === 'usuario') ? scriptUsuariopost : scriptpost}
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});`;

  const putroute = `
router.put('/${lowercaseTableName}', async (req, res) => {
  try {
    const  ${tableName}: ${capitalizedTableName}Entidad = req.body;
    const response = await ${capitalizedTableName}Negocio.update(${tableName});
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});`;

  const deleteroute = `
router.delete('/${lowercaseTableName}', async (req, res) => {
  try {
    const id = req.query.id as string;
    const response = await ${capitalizedTableName}Negocio.delete(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});`;

  const patchrouteUser = `
router.patch('/${lowercaseTableName}/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const {pswdNew, pswdOld} = req.body;
    const response = await ${capitalizedTableName}Negocio.updatePswd${capitalizedTableName}(id,pswdOld,pswdNew);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});`;

  const getByUser = `
router.patch('/${tableName}', async (req, res) => {
  try {
    const {usuario, pswd} = req.body;
    const response = await ${capitalizedTableName}Negocio.getByUser(usuario,pswd);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});`;

  const content = `
import { Router } from 'express';
const router = Router();
import ${capitalizedTableName}Negocio from '../Negocio/${capitalizedTableName}Negocio';
import ${capitalizedTableName}Entidad from '../Entidades/${capitalizedTableName}Entidad';
${postroute}
${putroute}
${deleteroute}
${getroute}
${(tableName === 'usuario') ? getByUser : ''}
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

  const carpeta = path.join(__dirname, 'Interfaces');
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
  
  constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private serviceUsuario: UsuarioService, private service: ${capitalizedTableName}Service) { }

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
    const userId = this.serviceUsuario.getUserLoggedId();
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
    const [tables] = await pool.execute<any>('SHOW TABLES');


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
      await generateServiceFile(pool, tableName);
      //await generateInterfaceFile(pool, tableName);
      //await generateComponentFile(pool, tableName, primaryKeyColumn);
      //await generateHTMLFile(pool, tableName, primaryKeyColumn);
    }
    console.info('Archivos creados correctamente');
  } catch (error: any) {
    console.error('Error: ' + error.message);
  } finally {
    process.exit(); // Esto cerrará el programa después de que se complete la ejecución
  }
}

main();
