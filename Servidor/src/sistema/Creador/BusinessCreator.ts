import { existsSync, mkdirSync, writeFileSync } from 'fs';
import path from 'path';
import Funciones from '../funciones/Funciones';

class BusinessCreator {
  tableName: string;
  capitalizedTableName: string;
  lowercaseTableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.capitalizedTableName = Funciones.stringToCapitalize(tableName);
    this.lowercaseTableName = Funciones.stringToCamelCase(tableName);
  }

  insert(): string {
    const functionInsert = `
  static async insert(${this.tableName}: ${this.capitalizedTableName}Entidad ${this.tableName === 'usuario' ? ', detalle?: UsuarioProfesorEntidad' : ''}): Promise<Respuesta> {
    try {
      return ${this.capitalizedTableName}Datos.insert(${this.tableName} ${this.tableName === 'usuario' ? ', detalle' : ''});
    } catch (error: any) {
      return {response: false, data: null, message:error.message }; 
    }
  }`;
    return functionInsert;
  }

  update(): string {
    const functionUpdate = `
        static async update(${this.tableName}: ${this.capitalizedTableName}Entidad): Promise<Respuesta> {
          try {
            return ${this.capitalizedTableName}Datos.update(${this.tableName});
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
            return ${this.capitalizedTableName}Datos.delete(id);
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
    return functionDelete;
  }

  getAll(): string {
    const functionGetAll = `
        static async getAll(${this.tableName === 'usuario' ? `tipo: string` : ''}): Promise<Respuesta> {
          try {
            return ${this.capitalizedTableName}Datos.getAll(${this.tableName === 'usuario' ? `tipo` : ''});
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
    return functionGetAll;
  }

  getEnabled(): string {
    const functionGetEnabled = `
        static async getEnabled(${this.tableName === 'usuario' ? `tipo: string` : ''}): Promise<Respuesta> {
          try {
            return ${this.capitalizedTableName}Datos.getEnabled(${this.tableName === 'usuario' ? `tipo` : ''});
      
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
        return ${this.capitalizedTableName}Datos.getById(id);
      } catch (error: any) {
        return {response: false, data: null, message:error.message }; 
      }
    }`;

    return functiongetById;
  }

  getByUser(): string {
    const functionGetByUser = `
    static async getByUser(${this.tableName}: string, pswd: string): Promise<Respuesta> {
      try {
        return ${this.capitalizedTableName}Datos.getByUser(${this.tableName}, pswd);
  
      } catch (error: any) {
        return { response: false, data: null, message:error.message } // Devuelve una Promise rechazada con el error
      }
    }`;
    return functionGetByUser;
  }

  getByCurso(): string {
    const functiongetByCurso = `
        static async getByCurso(id: String): Promise<Respuesta> {
          try {
            return ${this.capitalizedTableName}Datos.getByCurso(id);
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
    return functiongetByCurso;
  }

  getByParalelo(): string {
    const functiongetByParalelo = `
    static async getByParalelo(id: String): Promise<Respuesta> {
     try {
       return ${this.capitalizedTableName}Datos.getByParalelo(id);
     } catch (error: any) {
       return {response: false, data: null, message:error.message }; 
     }
   }`;
    return functiongetByParalelo;
  }

  getNoMatriculados(): string {
    const functionGetNoMatriculados = `
        static async getNoMatriculados(): Promise<Respuesta> {
          try {
            return ${this.capitalizedTableName}Datos.getNoMatriculados();
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
    return functionGetNoMatriculados;
  }

  insertMasivo(): string {
    const functioninsertarMasivamente = `
        static async insertMasivo(data:any): Promise<Respuesta> {
          try {
            return ${this.capitalizedTableName}Datos.insertMasivo(data);
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
    return functioninsertarMasivamente;
  }

  updateEstado(): string {
    const functionupdateEstado = `
        static async updateEstado(ids: string[]):Promise<Respuesta> {
          try {
            return ${this.capitalizedTableName}Datos.updateEstado(ids);
      
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
    return functionupdateEstado;
  }

  async generateNegocioFile(): Promise<void> {
    const otherFun = () => {
      if (this.tableName === 'usuario') {
        return this.getByUser();
      } else if (this.tableName === 'estudiante_curso') {
        return this.getNoMatriculados() + this.getByCurso() + this.insertMasivo();
      } else if (this.tableName === 'estudiante_curso_paralelo') {
        return this.insertMasivo() + this.getByParalelo();
      } else {
        return '';
      }
    };

    const content = `${this.tableName === 'usuario' ? `import UsuarioProfesorEntidad from '../entidades/UsuarioProfesorEntidad'; ` : ''}
      import ${this.capitalizedTableName}Datos from '../datos/${this.capitalizedTableName}Datos';
      import ${this.capitalizedTableName}Entidad from '../entidades/${this.capitalizedTableName}Entidad';
      import { Respuesta } from '../sistema/interfaces/Respuesta';
      
      class ${this.capitalizedTableName}Negocio {
        ${this.insert()}
        ${this.update()}
        ${this.updateEstado()}
        ${this.delete()}
        ${this.getAll()}
        ${this.getEnabled()}
        ${this.getById()}
        ${otherFun()}
      }
      
      export default ${this.capitalizedTableName}Negocio;`;

    const carpeta = path.join(__dirname, 'negocio');
    const archivo = path.join(carpeta, `${this.capitalizedTableName}Negocio.ts`);

    if (!existsSync(carpeta)) {
      mkdirSync(carpeta, { recursive: true });
    }
    writeFileSync(archivo, content, 'utf8');
  }
}

export default BusinessCreator;
