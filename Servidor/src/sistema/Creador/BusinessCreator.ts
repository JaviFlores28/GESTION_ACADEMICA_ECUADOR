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

  login(): string {
    const functionlogin = `
    static async login(data:any): Promise<Respuesta> {
      try {
        return ${this.capitalizedTableName}Datos.login(data);
  
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
            return ${this.capitalizedTableName}Datos.getByCurso(id);
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
    return functiongetByCurso;
  }

  getByCursoParalelo(): string {
    const functionGetByCursoParalelo = `
    static async getByCursoParalelo(data: any): Promise<Respuesta> {
     try {
       return ${this.capitalizedTableName}Datos.getByCursoParalelo(data);
     } catch (error: any) {
       return {response: false, data: null, message:error.message }; 
     }
   }`;
    return functionGetByCursoParalelo;
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

  getByPrf(): string {
    const functionGetByPrf = `
    static async getByPrf(data: any): Promise<Respuesta> {
      try {
        return ${this.capitalizedTableName}Datos.getByPrf(data);
      } catch (error: any) {
        return {response: false, data: null, message:error.message }; 
      }
    }`;
    return functionGetByPrf;
  }

  getByPeriodo(): string {
    const functionGetByPeriodo = `
    static async getByPeriodo(data: any): Promise<Respuesta> {
      try {
        return ${this.capitalizedTableName}Datos.getByPeriodo(data);
      } catch (error: any) {
        return {response: false, data: null, message:error.message }; 
      }
    }`;
    return functionGetByPeriodo;
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
            return ${this.capitalizedTableName}Datos.updateEstado(id);
      
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
    return functionupdateEstado;
  }

  async generateBusinessFile(): Promise<void> {
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

    const carpeta = path.join(__dirname, '../../negocio');
    const archivo = path.join(carpeta, `${this.capitalizedTableName}Negocio.ts`);

    if (!existsSync(carpeta)) {
      mkdirSync(carpeta, { recursive: true });
    }
    writeFileSync(archivo, content, 'utf8');
  }
}

export default BusinessCreator;
