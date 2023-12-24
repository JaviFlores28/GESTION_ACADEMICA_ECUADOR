import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import Funciones from '../funciones/Funciones';
import { MappedProperty } from '../interfaces/MappedProperty';

class DataCreator {
  tableName: string;
  capitalizedTableName: string;
  lowercaseTableName: string;
  propertiesTable: MappedProperty[];
  primaryKey: string;

  constructor(tableName: string, propertiesTable: MappedProperty[]) {
    this.tableName = tableName;
    this.primaryKey = propertiesTable.find((column) => column.key === 'PRI')?.name;
    this.propertiesTable = propertiesTable;
    this.capitalizedTableName = Funciones.stringToCapitalize(tableName);
    this.lowercaseTableName = Funciones.stringToCamelCase(tableName);
  }

  generateObject(propertiesData: MappedProperty[], tableName: string, excludedProperties: string[]) {
    return propertiesData
      .filter((property) => !excludedProperties.includes(property.name))
      .map((property) => `${tableName}.${property.name}`)
      .join(', ');
  }

  generatePropsToArray(propertiesData: MappedProperty[], excludedProperties: string[]) {
    return propertiesData
      .filter((property) => !excludedProperties.includes(property.name))
      .map((property) => `'${property.name}'`)
      .join(',');
  }

  insert(): string {
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
        static async insert(${this.tableName}: ${this.capitalizedTableName}Entidad ${this.tableName === 'usuario' ? ', detalle?: UsuarioProfesorEntidad' : ''}): Promise<Respuesta> {
          try {
            const pool = await BaseDatos.getInstanceDataBase();
            ${this.tableName === 'usuario' ? usuariodata : ''}
            ${this.tableName}.${this.primaryKey} = uuidv4(); 
            const new${this.capitalizedTableName} = new ${this.capitalizedTableName}Entidad(${this.generateObject(this.propertiesTable, this.tableName, ['FECHA_CREACION'])});
            let sql =this.sqlInsert;
            const [result] = await pool.execute<any>(sql, new${this.capitalizedTableName}.toArrayInsert());
            if (result.affectedRows !== 1) {
              throw new Error('No se pudo agregar ${this.capitalizedTableName}');
            }${this.tableName === 'usuario' ? conditionToInsertUser : ''}
            return {response: true, data:new${this.capitalizedTableName}.${this.primaryKey}, message: 'Se creo correctamente' };
          } catch (error: any) {
            
            return {response: false, data: null, message:error.message }; 
          }
        }`;

    return functioninsert;
  }

  update(): string {
    const functionUpdate = `
    static async update(${this.tableName}: ${this.capitalizedTableName}Entidad): Promise<Respuesta> {
      try {
        const pool = await BaseDatos.getInstanceDataBase();

        const new${this.capitalizedTableName} = new ${this.capitalizedTableName}Entidad(${this.generateObject(this.propertiesTable, this.tableName, ['FECHA_CREACION'])});
        let sql =this.sqlUpdate;
        const [result] = await pool.execute<any>(sql, new${this.capitalizedTableName}.toArrayUpdate());
        if (result.affectedRows !== 1) {
          throw new Error('No se pudo actualizar ${this.capitalizedTableName}');
        }
        return {response: true, data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
      } catch (error: any) {
        
        return {response: false, data: null, message:error.message }; 
      }
    }`;
    return functionUpdate;
  }

  delete(): string {
    const functionDelete = `
        static async delete(id: String): Promise<Respuesta> {
          try {
            const pool = await BaseDatos.getInstanceDataBase();
            let sql = this.sqlDelete;
            const [result] = await pool.execute<any>(sql, [id]);
            if (result.affectedRows !== 1) {
              throw new Error('No se pudo eliminar el objeto de tipo ${this.capitalizedTableName}');
            }
            return { response: true, data: true, message: 'Objeto eliminado' }
          } catch (error: any) {
            
            return { response: false, data: null, message:error.message }; 
          }
        }`;

    return functionDelete;
  }

  getAll(): string {
    const sqlToGetUser = `
          const userMapping = {
            'R': ' WHERE ROL_REPR=1',
            'P': ' WHERE ROL_PRF=1',
            'A': ' WHERE ROL_ADMIN=1'
          }as { [key: string]: string };
          const userClause = userMapping[tipo] || '';
          sql += userClause;
          `;

    const functionGet = `
        static async getAll(${this.tableName === 'usuario' ? 'tipo: string' : ''}): Promise<Respuesta> {
          try {
            const pool = await BaseDatos.getInstanceDataBase();
            let sql = this.sqlSelect;
            ${this.tableName === 'usuario' ? sqlToGetUser : ''}
            const [rows] = await pool.execute<any>(sql);
            if(rows.length <= 0){
              throw new Error('No se encontraron datos para ${this.capitalizedTableName}.');
            }
            return { response: true, data: rows as ${this.capitalizedTableName}Entidad[], message: '' };
          } catch (error: any) {
            
            return { response: false, data: null, message:error.message }; 
          }
        }`;

    return functionGet;
  }

  getEnabled(): string {
    const mapToGetUserEnabled = `
        const userMapping = {
          'R': ' AND ROL_REPR=1',
          'P': ' AND ROL_PRF=1',
          'A': ' AND ROL_ADMIN=1'
        }as { [key: string]: string };
        const userClause = userMapping[tipo] || '';
        sql += userClause;
        `;

    const functionGetEnabled = `
        static async getEnabled(${this.tableName === 'usuario' ? 'tipo: string' : ''}): Promise<Respuesta> {
          try {
            const pool = await BaseDatos.getInstanceDataBase();
            let sql = this.sqlGetEnabled;
            ${this.tableName === 'usuario' ? mapToGetUserEnabled : ''}
            const [rows] = await pool.execute<any>(sql);
            if(rows.length <= 0){
              throw new Error('No se encontraron datos para ${this.capitalizedTableName}.');
            }
            return {response: true, data: rows as ${this.capitalizedTableName}Entidad[], message: '' };
          } catch (error: any) {
            
            return {response: false, data: null, message:error.message }; 
          }
        }`;
    return functionGetEnabled;
  }

  getById(): string {
    const functiongetById = `
        static async getById(id: String): Promise<Respuesta> {
          try {
            const pool = await BaseDatos.getInstanceDataBase();
            let sql = this.sqlGetById;
            const [rows] = await pool.execute<any>(sql, [id]);
            if (rows.length <= 0) {
              throw new Error('Objeto de tipo ${this.capitalizedTableName} no encontrado');
            }
            let new${this.capitalizedTableName} = rows[0] as ${this.capitalizedTableName}Entidad;
            return {response: true, data: new${this.capitalizedTableName}, message: 'Encontrado' };
          } catch (error: any) {
            
            return {response: false, data: null, message:error.message }; 
          }
        }`;

    return functiongetById;
  }

  login(): string {
    const functionlogin = `
    static async login(data:any): Promise<Respuesta> {
      try {
        const pool = await BaseDatos.getInstanceDataBase();
        let sql = this.sqllogin;
        const [rows] = await pool.execute<any>(sql, [data.usuario]);
  
        if (rows.length <= 0) {
          throw new Error('${this.capitalizedTableName} no encontrado');
        }
  
        const pswdDecrypt = Funciones.decrypt(rows[0].USR_PSWD);
  
        if (!Funciones.pswdValid(pswdDecrypt, data.pswd)) {
          throw new Error('Contraseña incorrecta');
        }
        let new${this.capitalizedTableName} = rows[0] as ${this.capitalizedTableName}Entidad;
        new${this.capitalizedTableName}.USR_PSWD = 'pswd';
        return {response: true, data: new${this.capitalizedTableName}, message: '${this.capitalizedTableName} Valido' }
      } catch (error: any) {
        
        return { response: false, data: null, message:error.message } // Devuelve una Promise rechazada con el error
      }
    }`;
    return functionlogin;
  }

  getByCurso(): string {
    const functiongetByCurso = `
        static async getByCurso(id: String): Promise<Respuesta> {
          try {
            const pool = await BaseDatos.getInstanceDataBase();
            let sql = this.sqlGetByCurso;
            const [rows] = await pool.execute<any>(sql, [id]);
            return { response: true, data: rows as ${this.capitalizedTableName}Entidad[], message: '' };
          } catch (error: any) {
            
            return {response: false, data: null, message:error.message }; 
          }
        }`;
    return functiongetByCurso;
  }

  getByCursoParalelo(): string {
    const functiongetByCursoParalelo = `
        static async getByCursoParalelo(data: any): Promise<Respuesta> {
          try {
            const pool = await BaseDatos.getInstanceDataBase();
            let sql = this.sqlGetByCursoParalelo;
            const [rows] = await pool.execute<any>(sql, [data.PRLL_ID,data.AL_ID,data.CRS_ID]);
            return { response: true, data: rows as ${this.capitalizedTableName}Entidad[], message: '' };
          } catch (error: any) {
            
            return {response: false, data: null, message:error.message }; 
          }
        }`;

    return functiongetByCursoParalelo;
  }

  getByPrf(): string {
    const functionGetByPrf = `static async getByPrf(data: any): Promise<Respuesta> {
      try {
        
        const pool = await BaseDatos.getInstanceDataBase();
        let sql = this.sqlGetByPrf;
        const [rows] = await pool.execute<any>(sql, [data.AL_ID, data.PRF_ID]);
        if (rows.length <= 0) {
          throw new Error('Objeto de tipo ${this.capitalizedTableName} no encontrado');
        }
        return { response: true, data:rows as ${this.capitalizedTableName}Entidad[], message: 'Encontrado' };
      } catch (error: any) {
        
        return { response: false, data: null, message: error.message };
      }
    }`;
    return functionGetByPrf;
  }

  getNoMatriculados(): string {
    const functionGetNoMatriculados = `
    static async getNoMatriculados(): Promise<Respuesta> {
      try {
        const pool = await BaseDatos.getInstanceDataBase();
        let sql = this.sqlGetNoMatriculados;
        const [rows] = await pool.execute<any>(sql);
        return {response: true, data: rows as ${this.capitalizedTableName}Entidad[], message: '' };
      } catch (error: any) {
        
        return {response: false, data: null, message:error.message }; 
      }
    }`;
    return functionGetNoMatriculados;
  }

  getByPeriodo(): string {
    const functiongetById = `
        static async getByPeriodo(id: String): Promise<Respuesta> {
          try {
            const pool = await BaseDatos.getInstanceDataBase();
            let sql = this.sqlGetByPeriodo;
            const [rows] = await pool.execute<any>(sql, [id]);
            if (rows.length <= 0) {
              throw new Error('Objeto de tipo ${this.capitalizedTableName} no encontrado');
            }
            return {response: true, data: rows as ${this.capitalizedTableName}Entidad[], message: 'Encontrado' };
          } catch (error: any) {
            
            return {response: false, data: null, message:error.message }; 
          }
        }`;

    return functiongetById;
  }

  insertMasivo(): string {
    const excludedProperties = ['FECHA_CREACION', this.primaryKey, 'EST_ID', 'EST_CRS_ID', 'ASG_ID'];

    const functioninsertarMasivamente = `
        static async insertMasivo(data:any): Promise<Respuesta> {
          try {
            const pool = await BaseDatos.getInstanceDataBase();
            const arrayIds = data.arrayIds;
      
            // Crear un array de valores para todos los registros utilizando map
            const valores = arrayIds.map((id: any) => [
              uuidv4(), id, ${this.generateObject(this.propertiesTable, 'data', excludedProperties)}
            ]); 
      
            // Crear una cadena de marcadores de posición y una cadena de campos
            const placeholders = valores.map((fila: string | any[]) => \`(\${Array.from({ length: fila.length }, () => '?').join(',')})\`).join(',');
      
            const campos = [${this.generatePropsToArray(this.propertiesTable, ['FECHA_CREACION'])}].join(',');
      
            // Consulta SQL con la cláusula INSERT INTO y VALUES
            const sql = \`INSERT INTO ${this.tableName} (\${campos}) VALUES \${placeholders};\`;
      
            // Ejecutar la consulta con el array de valores
            const [result] = await pool.execute<any>(sql, valores.flat());
      
            // Verificar si se afectaron filas
            if (result.affectedRows < 1) {
              throw new Error('No se pudieron insertar los datos');
            }
      
            return {response: true, data: true, message: 'Datos insertados correctamente' };
          } catch (error: any) {      
            
            return {response: false, data: false, message:error.message };
          }
        }`;
    return functioninsertarMasivamente;
  }

  deleteMasivo(): string {
    const functiondeleteMasivo = `
    static async deleteMasivo(ids: string[]): Promise<Respuesta> {
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
        return {response: true, data: true, message: 'Datos eliminados correctamente' };
      } catch (error: any) {
        return {response: false, data: false, message:error.message };
      }
    }`;
    return functiondeleteMasivo;
  }

  updateEstado(): string {
    const functionupdateEstado = `  
        static async updateEstado(ids: string[]): Promise<Respuesta> {
          try {
            const pool = await BaseDatos.getInstanceDataBase();
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
            
            return {response: false, data: null, message:error.message };
          }
        }`;

    return functionupdateEstado;
  }

  generateSqlInsert(): { headers: string; marcadores: string } {
    const excludedProperties = ['FECHA_CREACION'];
    const filteredProperties = this.propertiesTable.filter((property: any) => !excludedProperties.includes(property.name));

    const marcadores = filteredProperties.map(() => '?').join(', ');
    const headers = filteredProperties.map((property: any) => property.name).join(', ');

    return { headers, marcadores };
  }

  generarSQLUpdate(): string {
    const excludedProperties = ['USUARIO', 'USR_PSWD', 'FECHA_CREACION'];
    return this.propertiesTable
      .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
      .map((property) => `${property.name}=?`)
      .join(',');
  }

  async generateDataFile(): Promise<void> {
    const generarSQLinsert = this.generateSqlInsert();
    const generarSQLupdate = this.generarSQLUpdate();
    const sqlGetByCurso = `static sqlGetByCurso: string = 'SELECT A.* FROM vista_estudiante_curso A INNER JOIN estudiante_curso B ON A.EST_CRS_ID = B.EST_CRS_ID LEFT JOIN estudiante_curso_paralelo ECP ON A.EST_CRS_ID = ECP.EST_CRS_ID AND ECP.ESTADO = 1 WHERE A.ESTADO = 1 AND B.CRS_ID = ? AND ECP.EST_CRS_ID IS NULL;';`;
    const sqlGetNoMatriculados = `static sqlGetNoMatriculados: string = 'SELECT a.* FROM vista_estudiante AS a LEFT JOIN estudiante_curso AS b ON b.EST_ID = a.EST_ID AND (b.ESTADO = 1 OR b.CRS_ID = (SELECT CRS_ID FROM curso ORDER BY CRS_ORDEN DESC LIMIT 1)) WHERE A.ESTADO=1 AND b.EST_ID IS NULL;';`;
    const sqllogin = `static sqllogin: string = 'SELECT * FROM ${this.tableName} WHERE USUARIO = ?';`;
    const sqlGetByCursoParalelo = `static sqlGetByCursoParalelo: string = 'SELECT a.* FROM vista_estudiante_curso_paralelo AS a INNER JOIN estudiante_curso_paralelo AS b ON a.EST_CRS_PRLL_ID = b.EST_CRS_PRLL_ID INNER JOIN estudiante_curso AS c ON c.EST_CRS_ID = b.EST_CRS_ID WHERE b.PRLL_ID = ? AND b.AL_ID = ? AND b.ESTADO = 1 AND c.CRS_ID = ? AND c.ESTADO = 1;';`;
    const sqlGetByPrf = `static sqlGetByPrf: string = 'SELECT a.* FROM vista_profesor_asignatura_paralelo as a JOIN profesor_asignatura_paralelo as b ON a.PRF_ASG_PRLL_ID = b.PRF_ASG_PRLL_ID WHERE b.ESTADO = 1 AND b.AL_ID = ? AND b.PRF_ID = ?;';`;
    const sqlGetByPeriodo = `static sqlGetByPeriodo: string = 'SELECT * FROM ${this.tableName} WHERE PRD_ID = ?';`;

    const isViewTable = () => {
      switch (this.tableName) {
        case 'estudiante':
        case 'usuario':
        case 'estudiante_curso':
        case 'estudiante_curso_paralelo':
        case 'profesor_asignatura_paralelo':
          return `vista_${this.tableName}`;
        default:
          return this.tableName;
      }
    };

    const importsTable = () => {
      switch (this.tableName) {
        case 'usuario':
          return `import UsuarioProfesorDatos from './UsuarioProfesorDatos';
                  import UsuarioProfesorEntidad from '../entidades/UsuarioProfesorEntidad';`;
        case 'estudiante_curso_paralelo':
          return ``;
        default:
          return '';
      }
    };

    const otherSql = () => {
      switch (this.tableName) {
        case 'usuario':
          return sqllogin;
        case 'estudiante_curso':
          return sqlGetNoMatriculados + '\n' + sqlGetByCurso;
        case 'estudiante_curso_paralelo':
          return sqlGetByCursoParalelo;
        case 'profesor_asignatura_paralelo':
          return sqlGetByPrf;
        case 'parcial':
          return sqlGetByPeriodo;
        default:
          return '';
      }
    };

    const otherFun = () => {
      switch (this.tableName) {
        case 'usuario':
          return this.login();
        case 'estudiante_curso':
          return this.getNoMatriculados() + this.getByCurso() + this.insertMasivo();
        case 'estudiante_curso_paralelo':
          return this.insertMasivo() + this.getByCursoParalelo();
        case 'profesor_asignatura_paralelo':
          return this.getByPrf() + this.insertMasivo();
        case 'parcial':
          return this.getByPeriodo();
        default:
          return '';
      }
    };

    const ORDER = () => {
      switch (this.tableName) {
        case 'curso':
          return 'ORDER BY CRS_ORDEN ASC';
        case 'paralelo':
          return 'ORDER BY PRLL_NOM ASC';
        case 'usuario':
        case 'profesor_asignatura_paralelo':
        case 'estudiante_curso_paralelo':
        case 'estudiante_curso':
          return '';
        default:
          return 'ORDER BY ESTADO DESC';
      }
    };

    const content = `${importsTable()}
      import Funciones from '../sistema/funciones/Funciones';
      import BaseDatos from '../sistema/conexion/BaseDatos';
      import { Respuesta } from '../sistema/interfaces/Respuesta';
      import ${this.capitalizedTableName}Entidad from '../entidades/${this.capitalizedTableName}Entidad';
      import { v4 as uuidv4 } from 'uuid';
      
      class ${this.capitalizedTableName}Datos {
        
        static sqlInsert: string = \`INSERT INTO ${this.tableName} (${generarSQLinsert.headers})VALUES(${generarSQLinsert.marcadores});\`;
        static sqlUpdate: string = \`UPDATE ${this.tableName} SET ${generarSQLupdate} WHERE ${this.primaryKey}=?;\`;
        static sqlUpdateEstado: string = 'UPDATE ${this.tableName} SET ESTADO = CASE WHEN ESTADO = 1 THEN 0 ELSE 1 END  WHERE  ${this.primaryKey} IN';
        static sqlDelete: string = \`DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ?\`;
        static sqlSelect: string = \`SELECT * FROM ${isViewTable()} ${ORDER()}\`;
        static sqlGetById: string = 'SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ?';
        static sqlGetEnabled: string = 'SELECT * FROM ${isViewTable()} WHERE ESTADO = 1 ${ORDER()}';
        ${otherSql()}
        ${this.insert()}
        ${this.update()}
        ${this.updateEstado()}
        ${this.delete()}
        ${this.getAll()}
        ${this.getById()}
        ${this.getEnabled()}
        ${otherFun()}
      }
      export default ${this.capitalizedTableName}Datos;
      `;

    const carpetaEntidades = path.join(__dirname, '../../datos');
    const archivoEntidad = path.join(carpetaEntidades, `${this.capitalizedTableName}Datos.ts`);

    if (!existsSync(carpetaEntidades)) {
      mkdirSync(carpetaEntidades, { recursive: true });
    }

    writeFileSync(archivoEntidad, content, 'utf8');
  }
}
export default DataCreator;
