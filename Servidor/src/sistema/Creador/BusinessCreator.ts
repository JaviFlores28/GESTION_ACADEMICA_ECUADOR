import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import Funciones from "../funciones/Funciones";

class BusinessCreator {
    async generateNegocioFile(tableName: string): Promise<void> {
        const capitalizedTableName = Funciones.stringToCapitalize(tableName);
      
        const functionInsert = `
        static async insert(${tableName}: ${capitalizedTableName}Entidad ${tableName === 'usuario' ? ', detalle?: UsuarioProfesorEntidad' : ''}): Promise<Respuesta> {
          try {
            return ${capitalizedTableName}Datos.insert(${tableName} ${tableName === 'usuario' ? ', detalle' : ''});
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
      
        const functioninsertarMasivamente = `
        static async insertMasivo(data:any): Promise<Respuesta> {
          try {
            return ${capitalizedTableName}Datos.insertMasivo(data);
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
      
        const functionUpdate = `
        static async update(${tableName}: ${capitalizedTableName}Entidad): Promise<Respuesta> {
          try {
            return ${capitalizedTableName}Datos.update(${tableName});
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
      
        const functionDelete = `
        static async delete(id: String): Promise<Respuesta> {
          try {
            return ${capitalizedTableName}Datos.delete(id);
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
      
        const functionGetAll = `
        static async getAll(${tableName === 'usuario' ? `tipo: string` : ''}): Promise<Respuesta> {
          try {
            return ${capitalizedTableName}Datos.getAll(${tableName === 'usuario' ? `tipo` : ''});
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
      
        const functiongetById = `
        static async getById(id: String): Promise<Respuesta> {
          try {
            return ${capitalizedTableName}Datos.getById(id);
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
      
        const functiongetByCurso = `
        static async getByCurso(id: String): Promise<Respuesta> {
          try {
            return ${capitalizedTableName}Datos.getByCurso(id);
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
      
        const functionGetEnabled = `
        static async getEnabled(${tableName === 'usuario' ? `tipo: string` : ''}): Promise<Respuesta> {
          try {
            return ${capitalizedTableName}Datos.getEnabled(${tableName === 'usuario' ? `tipo` : ''});
      
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
      
        const functionGetByUser = `
        static async getByUser(${tableName}: string, pswd: string): Promise<Respuesta> {
          try {
            return ${capitalizedTableName}Datos.getByUser(${tableName}, pswd);
      
          } catch (error: any) {
            return { response: false, data: null, message:error.message } // Devuelve una Promise rechazada con el error
          }
        }`;
      
        const functionGetNoMatriculados = `
        static async getNoMatriculados(): Promise<Respuesta> {
          try {
            return ${capitalizedTableName}Datos.getNoMatriculados();
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
      
        const functionupdateEstado = `
        static async updateEstado(ids: string[]):Promise<Respuesta> {
          try {
            return ${capitalizedTableName}Datos.updateEstado(ids);
      
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
      
        const functiongetByParalelo = `
         static async getByParalelo(id: String): Promise<Respuesta> {
          try {
            return ${capitalizedTableName}Datos.getByParalelo(id);
          } catch (error: any) {
            return {response: false, data: null, message:error.message }; 
          }
        }`;
      
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
        ${otherFun(tableName)}
      }
      
      export default ${capitalizedTableName}Negocio;`;
      
        const carpeta = path.join(__dirname, 'negocio');
        const archivo = path.join(carpeta, `${capitalizedTableName}Negocio.ts`);
      
        if (!existsSync(carpeta)) {
          mkdirSync(carpeta, { recursive: true });
        }
        writeFileSync(archivo, content, 'utf8');
      }
}

export default BusinessCreator;