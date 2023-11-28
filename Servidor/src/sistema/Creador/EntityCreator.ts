import path from 'path';
import Funciones from '../funciones/Funciones';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { MappedProperty } from '../interfaces/MappedProperty';

class EntityCreator {
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

  async generateEntityFile(): Promise<void> {
    const excludedPropertiesInsert = ['FECHA_CREACION'];
    const excludedPropertiesUpdate = ['USUARIO', 'USR_PSWD', 'FECHA_CREACION', 'CREADOR_ID', this.primaryKey];

    const content = `
      class ${this.capitalizedTableName}Entidad {
        ${Funciones.generatePropsDefinitions(this.propertiesTable)} 
           
          constructor(${Funciones.generatePropsConstruct(this.propertiesTable)}) {
             ${Funciones.generatePropsValues(this.propertiesTable)}
          }
      
          toArrayInsert(): any[] {
            return [${Funciones.generateFunctionToarray(this.propertiesTable, excludedPropertiesInsert)}];
          }
      
          toArrayUpdate(): any[] {
            return [${Funciones.generateFunctionToarray(this.propertiesTable, excludedPropertiesUpdate)}, this.${this.primaryKey}];
          }
      }
      
      export default ${this.capitalizedTableName}Entidad;
      `;

    const carpetaEntidades = path.join(__dirname, '../../entidades');
    const archivoEntidad = path.join(carpetaEntidades, `${this.capitalizedTableName}Entidad.ts`);

    if (!existsSync(carpetaEntidades)) {
      mkdirSync(carpetaEntidades, { recursive: true });
    }

    writeFileSync(archivoEntidad, content, 'utf8');
  }
}
export default EntityCreator;
