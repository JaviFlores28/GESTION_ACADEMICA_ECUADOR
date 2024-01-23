import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import Funciones from "../funciones/Funciones";
import EntityCreator from "./EntityCreator";
import { MappedProperty } from "../interfaces/MappedProperty";

class InterfaceCreator {
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

    async generateInterfaceFile() : Promise<void>{
        const capitalizedTableName = this.capitalizedTableName;
        const content = `export interface ${capitalizedTableName} {
          ${EntityCreator.generatePropsDefinitions(this.propertiesTable)}
        }`;

        const carpeta = path.join(__dirname, '../../interfaces');
        const archivo = path.join(carpeta, `${capitalizedTableName}.interface.ts`);

        if (!existsSync(carpeta)) {
            mkdirSync(carpeta, { recursive: true });
        }

        writeFileSync(archivo, content, 'utf8');
    }
}
export default InterfaceCreator;