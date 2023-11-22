import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import pool from './sistema/conexion/BaseDatos';
import Funciones from './sistema/funciones/Funciones';
import * as dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();
const { DB_DATABASE } = process.env;

/**
 * Generates an entity file based on the provided table name and primary key column.
 *
 * @param connection - The database connection object.
 * @param tableName - The name of the table.
 * @param primaryKeyColumn - The name of the primary key column.
 * @returns {Promise<void>} - A promise that resolves when the entity file is generated.
 */
async function generateEntityFile(connection: any, tableName: string, primaryKeyColumn: string): Promise<void> {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);
  const properties = await Funciones.getTableInfo(connection, tableName);
  const propertiesData = Funciones.mapProperties(properties);

  const excludedPropertiesInsert = ['FECHA_CREACION'];
  const excludedPropertiesUpdate = ['USUARIO', 'USR_PSWD', 'FECHA_CREACION', 'CREADOR_ID', primaryKeyColumn];

  const content = `
class ${capitalizedTableName}Entidad {
  ${Funciones.generatePropsDefinitions(propertiesData)} 
     
    constructor(${Funciones.generatePropsConstruct(propertiesData)}) {
       ${Funciones.generatePropsValues(propertiesData)}
    }

    toArrayInsert(): any[] {
      return [${Funciones.generateFunctionToarray(propertiesData, excludedPropertiesInsert)}];
    }

    toArrayUpdate(): any[] {
      return [${Funciones.generateFunctionToarray(propertiesData, excludedPropertiesUpdate)}, this.${primaryKeyColumn}];
    }
}

export default ${capitalizedTableName}Entidad;
`;

  const carpetaEntidades = path.join(__dirname, 'entidades');
  const archivoEntidad = path.join(carpetaEntidades, `${capitalizedTableName}Entidad.ts`);

  if (!existsSync(carpetaEntidades)) {
    mkdirSync(carpetaEntidades, { recursive: true });
  }

  writeFileSync(archivoEntidad, content, 'utf8');
}

/**
 * Generates a data file for a given table.
 *
 * @param connection - The database connection.
 * @param tableName - The name of the table.
 * @param primaryKeyColumn - The name of the primary key column.
 * @returns A Promise that resolves to a response object.
 */
async function generateDataFile(connection: any, tableName: string, primaryKeyColumn: string) {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);
  const properties = await Funciones.getTableInfo(connection, tableName);
  const propertiesData = Funciones.mapProperties(properties);

  const usuariodata = `usuario.USUARIO = Funciones.crearUsuario(usuario.USR_DNI, usuario.USR_NOM, usuario.USR_NOM2, usuario.USR_APE);
  usuario.USR_PSWD = Funciones.encrypt(usuario.USR_DNI);
  `;

  const conditionToInsertUser = `else {
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
  static async insert(${tableName}: ${capitalizedTableName}Entidad ${tableName === 'usuario' ? ', detalle?: UsuarioProfesorEntidad' : ''}): Promise<Respuesta> {
    try {
      ${tableName}.${primaryKeyColumn} = uuidv4(); 
      ${tableName === 'usuario' ? usuariodata : ''}
      const new${capitalizedTableName} = new ${capitalizedTableName}Entidad(${Funciones.generateObject(propertiesData, tableName, ['FECHA_CREACION'])});

      let sql =this.sqlInsert;
      const [result] = await pool.execute<any>(sql, new${capitalizedTableName}.toArrayInsert());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar ${capitalizedTableName}');
      }${tableName === 'usuario' ? conditionToInsertUser : ''}
      return {response: true, data:new${capitalizedTableName}.${primaryKeyColumn}, message: 'Se creo correctamente' };
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const functionUpdate = `
  static async update(${tableName}: ${capitalizedTableName}Entidad): Promise<Respuesta> {
    try {
      const new${capitalizedTableName} = new ${capitalizedTableName}Entidad(${Funciones.generateObject(propertiesData, tableName, ['FECHA_CREACION'])});
      let sql =this.sqlUpdate;
      const [result] = await pool.execute<any>(sql, new${capitalizedTableName}.toArrayUpdate());
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar ${capitalizedTableName}');
      }
      return {response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
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
      return { response: false, data: null, message: error.code }; 
    }
  }`;

  const sqlToUser = `
    const userMapping = {
      'R': ' WHERE ROL_REPR=1',
      'P': ' WHERE ROL_PRF=1',
      'A': ' WHERE ROL_ADMIN=1'
    }as { [key: string]: string };
    const userClause = userMapping[tipo] || '';
    sql += userClause;
    `;

  const functionGet = `
  static async getAll(${tableName === 'usuario' ? 'tipo: string' : ''}): Promise<Respuesta> {
    try {
      let sql = this.sqlSelect;
      ${tableName === 'usuario' ? sqlToUser : ''}
      const [rows] = await pool.execute<any>(sql);
      return { response: true, data: rows as ${capitalizedTableName}Entidad[], message: '' };
    } catch (error: any) {
      return { response: false, data: null, message: error.code }; 
    }
  }`;

  const mapToUserEnabled = `
  const userMapping = {
    'R': ' AND ROL_REPR=1',
    'P': ' AND ROL_PRF=1',
    'A': ' AND ROL_ADMIN=1'
  }as { [key: string]: string };
  const userClause = userMapping[tipo] || '';
  sql += userClause;
  `;

  const functionGetEnabled = `
  static async getEnabled(${tableName === 'usuario' ? 'tipo: string' : ''}): Promise<Respuesta> {
    try {
      let sql = this.sqlGetEnabled;
      ${tableName === 'usuario' ? mapToUserEnabled : ''}
      const [rows] = await pool.execute<any>(sql);
      return {response: true, data: rows as ${capitalizedTableName}Entidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
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
      return {response: false, data: null, message: error.code }; 
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

  const functiongetByCurso = `
  static async getByCurso(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetByCurso;
      const [rows] = await pool.execute<any>(sql, [id]);
      return { response: true, data: rows as ${capitalizedTableName}Entidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const functiongetByParalelo = `
  static async getByParalelo(id: String): Promise<Respuesta> {
    try {
      let sql = this.sqlGetByParalelo;
      const [rows] = await pool.execute<any>(sql, [id]);
      return { response: true, data: rows as ${capitalizedTableName}Entidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const functionGetNoMatriculados = `
  static async getNoMatriculados(): Promise<Respuesta> {
    try {
      let sql = this.sqlGetNoMatriculados;
      const [rows] = await pool.execute<any>(sql);
      return {response: true, data: rows as ${capitalizedTableName}Entidad[], message: '' };
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const excludedProperties = ['FECHA_CREACION', primaryKeyColumn, 'EST_ID', 'ESTADO', 'CREADOR_ID', 'EST_CRS_ID', 'PASE', 'AL_ID'];

  const functioninsertarMasivamente = `
  static async insertMasivo(data:any): Promise<Respuesta> {
    try {
      const arrayIds = data.arrayIds;
      const estado = 1;
      ${tableName === 'estudiante_curso_paralelo' ? `const anio =(await AnioLectivoDatos.getEnabled()).data[0].AL_ID;` : ''}

      // Crear un array de valores para todos los registros utilizando map
      const valores = arrayIds.map((id: any) => [
        uuidv4(),
        id,
        ${tableName === 'estudiante_curso_paralelo' ? `anio,` : ''}
        ${Funciones.generateObject(propertiesData, 'data', excludedProperties)},
        ${tableName === 'estudiante_curso_paralelo' ? `4,` : ''}
        estado,
        data.CREADOR_ID
      ]);      
      // Crear una cadena de marcadores de posición y una cadena de campos
      const placeholders = valores
        .map((fila: string | any[]) => \`(\${Array.from({ length: fila.length }, () => '?').join(',')})\`)
        .join(',');

      const campos = [${Funciones.generatePropsToArray(propertiesData, ['FECHA_CREACION'])}].join(',');

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

  const generarSQLinsert = Funciones.generateSqlInsert(propertiesData);
  const generarSQLupdate = Funciones.generarSQLUpdate(propertiesData);
  const sqlgetmatriculas = `static sqlGetByCurso: string = 'SELECT E.*, ec.EST_CRS_ID FROM vista_estudiante E JOIN estudiante_curso EC ON E.EST_ID = EC.EST_ID JOIN CURSO C ON EC.CRS_ID = C.CRS_ID WHERE EC.ESTADO = 1 AND C.CRS_ID = ?;'`;
  const sqlGetNoMatriculados = `static sqlGetNoMatriculados: string = 'SELECT a.* FROM vista_estudiante AS a WHERE NOT EXISTS ( SELECT 1 FROM estudiante_curso AS b WHERE b.EST_ID = a.EST_ID AND (b.ESTADO = 1 OR b.CRS_ID = (SELECT CRS_ID FROM curso ORDER BY CRS_ORDEN DESC LIMIT 1)) ) AND a.ESTADO = 1;'`;
  const sqlGetByUser = `static sqlGetByUser: string = 'SELECT * FROM ${tableName} WHERE USUARIO = ?';`;
  const sqlGetByParalelo = `static sqlGetByParalelo: string = 'SELECT * FROM ${tableName} WHERE USUARIO = ?';`;

  const isViewTable = (tableName: string) => {
    if (tableName === 'estudiante' || tableName === 'usuario' || tableName === 'estudiante_curso') {
      return `vista_${tableName}`;
    } else {
      tableName;
    }
  };

  const importsTable = (tableName: string) => {
    if (tableName === 'usuario') {
      return `import Funciones from '../sistema/funciones/Funciones';
      import UsuarioProfesorDatos from './UsuarioProfesorDatos';
      import UsuarioProfesorEntidad from '../entidades/UsuarioProfesorEntidad';`;
    } else if (tableName === 'estudiante_curso_paralelo') {
      return `import AnioLectivoDatos from './AnioLectivoDatos';`;
    }
  };

  const otherSql = (tableName: string) => {
    if (tableName === 'usuario') {
      return sqlGetByUser;
    } else if (tableName === 'estudiante_curso') {
      return sqlGetNoMatriculados + '\n' + sqlgetmatriculas;
    } else if (tableName === 'estudiante_curso_paralelo') {
      return sqlGetByParalelo;
    } else {
      return '';
    }
  };

  const otherFun = (tableName: string) => {
    if (tableName === 'usuario') {
      return functionGetByUser;
    } else if (tableName === 'estudiante_curso') {
      return functionGetNoMatriculados + functiongetByCurso + functioninsertarMasivamente;
    } else if (tableName === 'estudiante_curso_paralelo') {
      return functioninsertarMasivamente + functiongetByParalelo;
    } else {
      return '';
    }
  };

  const content = `${importsTable(tableName)}
import pool from '../sistema/conexion/BaseDatos';
import { Respuesta } from '../sistema/interfaces/Respuesta';
import ${capitalizedTableName}Entidad from '../entidades/${capitalizedTableName}Entidad';
import { v4 as uuidv4 } from 'uuid';

class ${capitalizedTableName}Datos {
  
  static sqlInsert: string = \`INSERT INTO ${tableName} (${generarSQLinsert.headers})VALUES(${generarSQLinsert.marcadores});\`;
  static sqlUpdate: string = \`UPDATE ${tableName} SET ${generarSQLupdate} WHERE ${primaryKeyColumn}=?;\`;
  static sqlUpdateEstado: string = 'UPDATE ${tableName} SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  ${primaryKeyColumn} IN';
  static sqlDelete: string = \`DELETE FROM ${tableName} WHERE ${primaryKeyColumn} = ?\`;
  static sqlSelect: string = \`SELECT * FROM ${isViewTable(tableName)} \`;
  static sqlGetById: string = 'SELECT * FROM ${tableName} WHERE ${primaryKeyColumn} = ?';
  static sqlGetEnabled: string = 'SELECT * FROM ${isViewTable(tableName)} WHERE ESTADO = 1';
  ${otherSql(tableName)}
  ${functioninsert}
  ${functionUpdate}
  ${functionupdateEstado}
  ${functionDelete}
  ${functionGet}
  ${functiongetById}
  ${functionGetEnabled}
  ${otherFun(tableName)}
}
export default ${capitalizedTableName}Datos;
`;

  const carpetaEntidades = path.join(__dirname, 'datos');
  const archivoEntidad = path.join(carpetaEntidades, `${capitalizedTableName}Datos.ts`);

  if (!existsSync(carpetaEntidades)) {
    mkdirSync(carpetaEntidades, { recursive: true });
  }

  writeFileSync(archivoEntidad, content, 'utf8');
}

/**
 * Generates a negocio file based on the provided table name.
 *
 * @param tableName - The name of the table.
 * @returns {Promise<void>} - A promise that resolves when the file is generated.
 */
async function generateNegocioFile(tableName: string): Promise<void> {
  const capitalizedTableName = Funciones.stringToCapitalize(tableName);

  const functionInsert = `
  static async insert(${tableName}: ${capitalizedTableName}Entidad ${tableName === 'usuario' ? ', detalle?: UsuarioProfesorEntidad' : ''}): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.insert(${tableName} ${tableName === 'usuario' ? ', detalle' : ''});
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const functioninsertarMasivamente = `
  static async insertMasivo(data:any): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.insertMasivo(data);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const functionUpdate = `
  static async update(${tableName}: ${capitalizedTableName}Entidad): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.update(${tableName});
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const functionDelete = `
  static async delete(id: String): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.delete(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const functionGetAll = `
  static async getAll(${tableName === 'usuario' ? `tipo: string` : ''}): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getAll(${tableName === 'usuario' ? `tipo` : ''});
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const functiongetById = `
  static async getById(id: String): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getById(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const functiongetByCurso = `
  static async getByCurso(id: String): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getByCurso(id);
    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const functionGetEnabled = `
  static async getEnabled(${tableName === 'usuario' ? `tipo: string` : ''}): Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.getEnabled(${tableName === 'usuario' ? `tipo` : ''});

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
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
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const functionupdateEstado = `
  static async updateEstado(ids: string[]):Promise<Respuesta> {
    try {
      return ${capitalizedTableName}Datos.updateEstado(ids);

    } catch (error: any) {
      return {response: false, data: null, message: error.code }; 
    }
  }`;

  const content = `${tableName === 'usuario' ? `import UsuarioProfesorEntidad from '../entidades/UsuarioProfesorEntidad'; ` : ''}
import ${capitalizedTableName}Datos from '../datos/${capitalizedTableName}Datos';
import ${capitalizedTableName}Entidad from '../entidades/${capitalizedTableName}Entidad';
import { Respuesta } from '../sistema/interfaces/Respuesta';

class ${capitalizedTableName}Negocio {
  ${functionInsert}
  ${functionUpdate}
  ${functionupdateEstado}
  ${functionDelete}
  ${functionGetAll}
  ${functionGetEnabled}
  ${functiongetById}
  ${tableName === 'usuario' ? functionGetByUser : tableName === 'estudiante_curso' ? functionGetNoMatriculados + functiongetByCurso + functioninsertarMasivamente : ''}
}

export default ${capitalizedTableName}Negocio;`;

  const carpeta = path.join(__dirname, 'negocio');
  const archivo = path.join(carpeta, `${capitalizedTableName}Negocio.ts`);

  if (!existsSync(carpeta)) {
    mkdirSync(carpeta, { recursive: true });
  }
  writeFileSync(archivo, content, 'utf8');
}

/**
 * Generates a service file based on the provided table name.
 *
 * @param tableName - The name of the table.
 * @returns {Promise<void>} - A promise that resolves when the service file is generated.
 */
async function generateServiceFile(tableName: any): Promise<void> {
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
      ${tableName === 'usuario' ? `  const tipo = req.query.tipo as string;` : ''}
      switch (by) {
        case 'all':
          ${tableName} = await ${capitalizedTableName}Negocio.getAll(${tableName === 'usuario' ? `tipo` : ''});
          break;
        case 'enabled':
          ${tableName} = await ${capitalizedTableName}Negocio.getEnabled(${tableName === 'usuario' ? `tipo` : ''});
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
${tableName === 'usuario' ? scriptUsuarioPost : tableName === 'estudiante_curso' ? scriptPostMasivo : scriptPost}
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
    }${tableName === 'usuario' ? getByUser : ''}
      
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
import ${capitalizedTableName}Negocio from '../negocio/${capitalizedTableName}Negocio';
import ${capitalizedTableName}Entidad from '../entidades/${capitalizedTableName}Entidad';
import { TypeRequest } from '../sistema/interfaces/TypeRequest';
${postroute}
${putroute}
${patchRoute}
${deleteroute}
${getroute}
export default router;
`;
  const carpeta = path.join(__dirname, 'servicios');
  const archivo = path.join(carpeta, `${capitalizedTableName}Servicio.ts`);

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
      const primaryKeyResult = await Funciones.getPrimaryKey(pool, tableName);
      let primaryKeyColumn = 'ID'; // Valor predeterminado

      if (primaryKeyResult && primaryKeyResult.length > 0) {
        primaryKeyColumn = primaryKeyResult[0].Column_name;
      }
      await generateDataFile(pool, tableName, primaryKeyColumn);
      await generateEntityFile(pool, tableName, primaryKeyColumn);
      await generateNegocioFile(tableName);
      await generateServiceFile(tableName);
      //await generateInterfaceFile(pool, tableName);
      //await generateComponentFile(pool, tableName, primaryKeyColumn);
      //await generateHTMLFile(pool, tableName, primaryKeyColumn);
    }
    try {
      execSync(` npx prettier src/ --write --print-width 1000 --single-quote`);
      console.log('Archivo formateado correctamente con Prettier.');
    } catch (error: any) {
      console.error('Error al formatear el archivo con Prettier:', error.message);
    }
    console.info('Archivos creados correctamente');
  } catch (error: any) {
    console.error('Error: ' + error.code);
  } finally {
    process.exit(); // Esto cerrará el programa después de que se complete la ejecución
  }
}

main();
