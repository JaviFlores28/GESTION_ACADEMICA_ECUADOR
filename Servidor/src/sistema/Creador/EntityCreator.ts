import path from "path";
import Funciones from "../funciones/Funciones";
import { existsSync, mkdirSync, writeFileSync } from "fs";

class EntityCreator {

    async generateEntityFile(connection: any, tableName: string, primaryKeyColumn: string): Promise<void> {
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

}
export default EntityCreator;