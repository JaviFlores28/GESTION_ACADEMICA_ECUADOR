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

  static generatePropsDefinitions(propertiesData: MappedProperty[]) {
    return propertiesData
      .filter((property) => property.name !== 'FECHA_CREACION')
      .map((property) => `${property.name}: ${property.type};`)
      .join('\n    ');
  }

  static generatePropsConstruct(propertiesData: MappedProperty[]) {
    return propertiesData
      .filter((property) => property.name !== 'FECHA_CREACION')
      .map((property) => {
        return `${property.name}: ${property.type}`;
      })
      .join(', ');
  }

  generatePropsValues(propertiesData: MappedProperty[]) {
    return propertiesData
      .filter((property) => property.name !== 'FECHA_CREACION')
      .map((property) => {
        return `this.${property.name} = ${property.name};`;
      })
      .join('\n      ');
  }

  generateFunctionToarray(propertiesData: MappedProperty[], excludedProperties: string[]) {
    return propertiesData
      .filter((property) => !excludedProperties.includes(property.name))
      .map((property) => `this.${property.name}`)
      .join(',');
  }
  
  async generateEntityFile(): Promise<void> {
    const excludedPropertiesInsert = ['FECHA_CREACION'];
    const excludedPropertiesUpdate = ['USUARIO', 'USR_PSWD', 'FECHA_CREACION', 'CREADOR_ID', this.primaryKey];

    const content = `
      class ${this.capitalizedTableName}Entidad {
        ${EntityCreator.generatePropsDefinitions(this.propertiesTable)} 
           
          constructor(${EntityCreator.generatePropsConstruct(this.propertiesTable)}) {
             ${this.generatePropsValues(this.propertiesTable)}
          }
      
          toArrayInsert(): any[] {
            return [${this.generateFunctionToarray(this.propertiesTable, excludedPropertiesInsert)}];
          }
      
          toArrayUpdate(): any[] {
            return [${this.generateFunctionToarray(this.propertiesTable, excludedPropertiesUpdate)}, this.${this.primaryKey}];
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
