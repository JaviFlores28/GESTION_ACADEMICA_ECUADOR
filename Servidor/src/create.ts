import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';
import baseDatos from './Datos/BaseDatos';
import * as dotenv from 'dotenv';

dotenv.config();
const { DB_DATABASE } = process.env;

interface ColumnData {
  Type: string;
  Field: any;
  Key: any;
}

interface MappedProperty {
  name: any;
  type: any;
  key: any;
  type_old: any;
}

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

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function stringToCapitalize(tableName: string) {
  const words = tableName.split('_');
  const capitalizedWords = words.map((word: any) => capitalizeFirstLetter(word));
  return capitalizedWords.join('');
}

function stringToCamelCase(tableName: string) {
  return tableName
    .replace(/_(\w)/g, (_: any, match: string) => match.toLowerCase())
    .replace(/^\w/, (c: string) => c.toLowerCase());
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
  return propertiesData.map((property) => {
    if (property.name === 'FECHA_CREACION') {
      return `${property.name}?: ${property.type};`;
    } else {
      return `${property.name}: ${property.type};`;
    }
  }).join('\n    ');
}

function generatePropsConstruct(propertiesData: MappedProperty[]) {
  return propertiesData
    .filter((property) => property.name !== 'USUARIO' && property.name !== 'USR_PSWD')
    .map((property) => {
      if (property.name === 'FECHA_CREACION') {
        return `${property.name}?: ${property.type}`;
      } else {
        return `${property.name}: ${property.type}`;
      }
    })
    .join(', ');
}

function generatePropsValues(propertiesData: MappedProperty[]) {
  return propertiesData.map((property) => {
    if (property.name === 'USR_PSWD') {
      return `this.${property.name} = Funciones.encrypt(USR_DNI);`;
    } else if (property.name === 'USUARIO') {
      return `this.${property.name} = this.crearUsuario(USR_DNI, USR_NOM, USR_NOM2, USR_APE);`;
    } else {
      return `this.${property.name} = ${property.name};`;
    }
  }).join('\n      ');
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

function generatePropsInstance(propertiesData: MappedProperty[], table: string) {
  const excludedProperties = (table !== 'usuario') ? ['FECHA_CREACION'] : ['USUARIO', 'USR_PSWD', 'FECHA_CREACION', 'CREADOR_ID'];

  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name))
    .map((property) => `request.${property.name}`)
    .join(', ');
}

function generatePropsComponentForm(propertiesData: MappedProperty[]) {
  const excludedProperties = ['USR_ID', 'USR_PSWD', 'FECHA_CREACION', 'ESTADO', 'CREADOR_ID'];
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
    .map((property) => {
      if (property.type === 'Date') {
        return `${property.name}: [getFormattedDate(new Date()),Validators.required]`
      } else if (property.type_old.includes('tinyint')) {
        return `${property.name}: [false,Validators.required]`
      } else {
        return `${property.name}: ['',Validators.required]`
      }
    }
    )
    .join(',\n ');
}

function generatePropsComponentInstance(propertiesData: MappedProperty[]) {
  const excludedProperties = ['USR_ID', 'USR_PSWD', 'FECHA_CREACION', 'CREADOR_ID', 'USUARIO', 'ROL_ADMIN', 'ROL_REPR', 'ROL_PRF'];
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name) && property.key !== 'PRI')
    .map((property) => {
      if (property.type === 'Date') {
        return `${property.name}:this.form.value.${property.name} ? new Date(this.form.value.${property.name}) : new Date()`
      } else if (property.type_old.includes('tinyint')) {
        return `${property.name}: (this.form.value.${property.name}) ? 1 : 0`
      } else {
        return `${property.name}:this.form.value.${property.name}|| ''`
      }
    })
    .join(',\n ');
}

function generatePropsComponentFormFill(propertiesData: MappedProperty[]) {
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

async function generateEntityFile(connection: any, tableName: string, primaryKeyColumn: string) {
  const capitalizedTableName = stringToCapitalize(tableName);
  const properties = await getTableInfo(connection, tableName);
  const propertiesData = mapProperties(properties);

  const sqlInsert = `
sqlInsert(): { query: string; values: any[] } {
  const propiedades: any[] = [];
  const valores: any[] = [];

  // Iterar sobre las propiedades del objeto
  Object.keys(this).forEach(propiedad => {
      const valor = this[propiedad as keyof this];

      if (valor !== undefined && propiedad !== 'FECHA_CREACION') {
          propiedades.push(propiedad);

          if (typeof valor === 'string' || valor instanceof Date) {
              valores.push(valor);
          } else {
              valores.push(valor);
          }
      }
  });

  const valoresStr = propiedades.map(() => '?').join(', ');
  const propiedadesStr = propiedades.join(', ');

  const query = \`INSERT INTO ${tableName} (\${propiedadesStr}) VALUES (\${valoresStr});\`;

  return { query, values: valores };
}
`;

  const sqlUpdate = `
sqlUpdate(): { query: string; values: any[] } {
  const valoresStr: string[] = [];
  const valores: any[] = [];

  // Iterar sobre las propiedades del objeto
  Object.keys(this).forEach(propiedad => {
      const valor = this[propiedad as keyof this];

      if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== '${primaryKeyColumn}' && propiedad !== 'CREADOR_ID' ${(tableName === 'usuario') ? '&& propiedad!==\'USR_PSWD\' && propiedad!==\'USUARIO\'  && propiedad!==\'ROL_ADMIN\'  && propiedad!==\'ROL_PRF\'  && propiedad!==\'ROL_REPR\'' : ''}) {
          if (typeof valor === 'string') {
              valoresStr.push(\`\${propiedad} = ?\`);
              valores.push(valor);
          } else if (valor instanceof Date) {
              const fecha = valor.toISOString().slice(0, 10);
              valoresStr.push(\`\${propiedad} = ?\`);
              valores.push(fecha);
          } else {
              valoresStr.push(\`\${propiedad} = ?\`);
              valores.push(valor);
          }
      }
  });
  valores.push(this.${primaryKeyColumn});
  const query = \`UPDATE ${tableName} SET \${valoresStr.join(', ')} WHERE ${primaryKeyColumn} = ?;\`;
  return { query, values: valores };
}
`;

  const crearUsr = `
crearUsuario(dni:string,nom:string,nom2:string,ape:string) {
  let usr = '';
  usr += nom[0] || ''; // Agregamos el primer carácter de nom1 si existe
  usr += nom2[0] || '';// Usa ?. para evitar problemas con valores null o undefined
  usr += ape|| '';
  usr += dni.substring(dni.length - 4); // Obtener los últimos 4 caracteres
  return usr;
}`;

  const isValid = `
isValid(): boolean {
  return ${generatePropsIsValid(propertiesData)};
}
`;

  const content = `${(tableName === 'usuario') ? `import Funciones from "../Modelos/Funciones";` : ''}
class ${capitalizedTableName} {
  ${generatePropsDefinitions(propertiesData)}    
    constructor(${generatePropsConstruct(propertiesData)}) {
       ${generatePropsValues(propertiesData)}
    }
    ${sqlInsert}
    ${sqlUpdate}
    ${isValid}
    ${(tableName === 'usuario') ? crearUsr : ''}
}
export default ${capitalizedTableName};
`;

  const carpetaEntidades = path.join(__dirname, 'Entidades');
  const archivoEntidad = path.join(carpetaEntidades, `${capitalizedTableName}Entidad.ts`);

  if (!existsSync(carpetaEntidades)) {
    mkdirSync(carpetaEntidades, { recursive: true });
  }

  writeFileSync(archivoEntidad, content, 'utf8');

}

async function generateInterfaceFile(connection: any, tableName: string) {
  const capitalizedTableName = stringToCapitalize(tableName);
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

async function generateNegocioFile(tableName: string, primaryKeyColumn: string) {
  const capitalizedTableName = stringToCapitalize(tableName);

  const functionAdd = `
  static async add${capitalizedTableName}(${tableName}: ${capitalizedTableName}): Promise<{ data: string | null, message: string }> {
    try {
      if (!${tableName}.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo ${capitalizedTableName} no tiene la estructura esperada.');
      }
      ${tableName}.${primaryKeyColumn} = uuidv4(); //asigna un identificador unico
      let sql = ${tableName}.sqlInsert();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo agregar ${capitalizedTableName}');
      }
      return { data:${tableName}.${primaryKeyColumn}, message: 'Se creo correctamente' }; // Retorna el ID del ${capitalizedTableName}
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionUpdate = `
  static async update${capitalizedTableName}(${tableName}: ${capitalizedTableName}): Promise<{ data: boolean, message: string }> {
    try {
      if (!${tableName}.isValid()){ //validar estructura del objeto
        throw new Error('Objeto de tipo ${capitalizedTableName} no tiene la estructura esperada.');
      }
      let sql = ${tableName}.sqlUpdate();
      const [result] = await baseDatos.execute<any>(sql.query, sql.values);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar ${capitalizedTableName}');
      }
      return { data: true, message: 'Campos actualizados' }; // Retorna true si se pudo actualizar;
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionDelete = `
  static async delete${capitalizedTableName}(id: String): Promise<{ data: boolean, message: string }> {
    try {
      let sql = 'delete FROM ${tableName} WHERE ${primaryKeyColumn} = ?';
      const [result] = await baseDatos.execute<any>(sql, [id]);
      if (result.affectedRows !== 1) {
        throw new Error('No se pudo eliminar el objeto de tipo ${capitalizedTableName}');
      }
      return { data: true, message: 'Objeto eliminado' }
    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionGet = `
  static async get${capitalizedTableName}(): Promise<{ data: ${capitalizedTableName}[], message: string }> {
    try {
      let sql = 'SELECT * FROM ${tableName}';
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as ${capitalizedTableName}[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionGetEnabled = `
  static async getEnabled${capitalizedTableName}(): Promise<{ data: ${capitalizedTableName}[], message: string }> {
    try {
      let sql = 'SELECT * FROM ${tableName} where Estado=1';
      const [rows] = await baseDatos.execute<any>(sql);
      return { data: rows as ${capitalizedTableName}[], message: '' };
    } catch (error: any) {
      return { data: [], message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionSearch = `
  static async searchById(id: String): Promise<{ data: ${capitalizedTableName} | null; message: string }> {
    try {
      let sql = 'SELECT * FROM ${tableName} WHERE ${primaryKeyColumn} = ?';
      const [rows] = await baseDatos.execute<any>(sql, [id]);
      if (rows.length <= 0) {
        throw new Error('Objeto de tipo ${capitalizedTableName} no encontrado');
      }
      let new${capitalizedTableName} = rows[0] as ${capitalizedTableName};
      ${(tableName === 'usuario' ? `//new${capitalizedTableName}.USR_PSWD = 'pswd';` : '')}
      return { data: new${capitalizedTableName}, message: 'Encontrado' };
    } catch (error: any) {
      return { data: null, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionUpdatePswdUser = `
  static async updatePswd${capitalizedTableName}(id: string, pswdOld: string, pswdNew: string): Promise<{ data: boolean, message: string }> {
    try {
      const { data: objeto, message } = await this.searchById(id);
      if (!objeto) {
        throw new Error(message);
      }

      let pswdUser = Funciones.decrypt(objeto.USR_PSWD);

      if (!this.pswdValid(pswdOld, pswdUser)) {
        throw new Error('Contraseña actual incorrecta.');
      }
      let sql = 'UPDATE ${tableName} SET USR_PSWD=? WHERE ${primaryKeyColumn} = ?';
      pswdNew = Funciones.encrypt(pswdNew);

      const [result] = await baseDatos.execute<any>(sql, [pswdNew, id]);

      if (result.affectedRows !== 1) {
        throw new Error('No se pudo actualizar el objeto de tipo ${capitalizedTableName}.');
      }
      return { data: true, message: 'Campos actualizados para el objeto de tipo ${capitalizedTableName}.' }; // Retorna true si se pudo actualizar

    } catch (error: any) {
      return { data: false, message: error.message }; // Retorna el mensaje del error
    }
  }`;

  const functionPswdValid = `
  static pswdValid(pswdInit: string, pswdSent: string): boolean {
    if (pswdInit === pswdSent) {
      return true;
    }
    return false;
  }`;

  const validar = `
  static async validar${capitalizedTableName}(${tableName}: string, pswd: string): Promise<{ data: ${capitalizedTableName} | null; message: string }> {
    try {
      let sql = 'SELECT * FROM ${tableName} WHERE USUARIO = ?';
      const [rows] = await baseDatos.execute<any>(sql, [${tableName}]);

      if (rows.length <= 0) {
        throw new Error('${capitalizedTableName} no encontrado');
      }

      const pswdDecrypt = Funciones.decrypt(rows[0].USR_PSWD);

      if (!this.pswdValid(pswdDecrypt, pswd)) {
        throw new Error('Contraseña incorrecta');
      }
      let new${capitalizedTableName} = rows[0] as ${capitalizedTableName};
      new${capitalizedTableName}.USR_PSWD = 'pswd';
      return { data: new${capitalizedTableName}, message: '${capitalizedTableName} Valido' }
    } catch (error: any) {
      return { data: null, message: error.message } // Devuelve una Promise rechazada con el error
    }
  }`;

  const content = `
import baseDatos from '../Datos/BaseDatos';
import ${capitalizedTableName} from '../Entidades/${capitalizedTableName}Entidad';
import { v4 as uuidv4 } from 'uuid';
${(tableName === 'usuario') ? `import Funciones from '../Modelos/Funciones';` : ''}

class ${capitalizedTableName}Negocio {
  ${functionGet}
  ${functionGetEnabled}
  ${functionSearch} 
  ${functionAdd}
  ${functionDelete}
  ${functionUpdate}
  ${(tableName === 'usuario') ? functionUpdatePswdUser + '\n' + validar + '\n' + functionPswdValid : ''}
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
  const capitalizedTableName = stringToCapitalize(tableName);
  const lowercaseTableName = stringToCamelCase(tableName);
  const properties = await getTableInfo(connection, tableName);
  const propertiesData = mapProperties(properties);

  const getroute = `
router.get('/${lowercaseTableName}', async (req, res) => {
   try {
    const ${tableName} = await ${capitalizedTableName}Negocio.get${capitalizedTableName}();
    res.json(${tableName});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});`;

  const getrouteEnabled = `
router.get('/${lowercaseTableName}Enabled', async (req, res) => {
   try {
    const ${tableName} = await ${capitalizedTableName}Negocio.getEnabled${capitalizedTableName}();
    res.json(${tableName});
  } catch (error: any) {
    res.status(500).json({ message: error.message });
   }
});`;

  const postroute = `
router.post('/${lowercaseTableName}', async (req, res) => {
   try {
    const request = req.body;
    const ${tableName} = new ${capitalizedTableName}Entidad(${generatePropsInstance(propertiesData, tableName)});
    const response = await ${capitalizedTableName}Negocio.add${capitalizedTableName}(${tableName});
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});`;

  const putroute = `
router.put('/${lowercaseTableName}', async (req, res) => {
  try {
    const request = req.body;
    const ${tableName} = new ${capitalizedTableName}Entidad(${generatePropsInstance(propertiesData, tableName)});
    const response = await ${capitalizedTableName}Negocio.update${capitalizedTableName}(${tableName});
    res.json(response);
  } catch (error: any) {
     res.status(500).json({ message: error.message });
   }
});`;

  const deleteroute = `
router.delete('/${lowercaseTableName}/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ${capitalizedTableName}Negocio.delete${capitalizedTableName}(id);
    res.json(response);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});`;

  const searchidroute = `
router.get('/${lowercaseTableName}/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await ${capitalizedTableName}Negocio.searchById(id);
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

  const validar = `
router.patch('/${capitalizedTableName}Validar', async (req, res) => {
  try {
    const {usuario, pswd} = req.body;
    const response = await ${capitalizedTableName}Negocio.validar${capitalizedTableName}(usuario,pswd);
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
${getroute}
${getrouteEnabled}
${postroute}
${putroute}
${deleteroute}
${searchidroute}
${(tableName === 'usuario') ? patchrouteUser + '\n' + validar : ''}
export default router;
`;
  const carpeta = path.join(__dirname, 'Servicios');
  const archivo = path.join(carpeta, `${capitalizedTableName}Servicio.ts`);

  if (!existsSync(carpeta)) {
    mkdirSync(carpeta, { recursive: true });
  }
  writeFileSync(archivo, content, 'utf8');
}

async function generateComponentFile(connection: any, tableName: any, primaryKeyColumn: string) {
  const capitalizedTableName = stringToCapitalize(tableName);
  const lowercaseTableName = stringToCamelCase(tableName);
  const properties = await getTableInfo(connection, tableName);
  const propertiesData = mapProperties(properties);

  const content = `
constructor(private ngBootstrap: NgbModal, private route: ActivatedRoute, private router: Router, private formBuilder: FormBuilder, private service: ${capitalizedTableName}Service) { }

modoEdicion: boolean = false;
elementoId: string = '';
form = this.formBuilder.group({
  ${generatePropsComponentForm(propertiesData)}
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
    let userid = localStorage.getItem(variables.KEY_NAME);
    if (userid) {
      userid = JSON.parse(atob(userid));
      const ${lowercaseTableName}: ${capitalizedTableName} = {
        ${generatePropsComponentInstance(propertiesData)},
       ${(tableName === 'usuario') ? ' ROL_PRF: 0,\nROL_REPR: 0,\nROL_ADMIN: 1,' : ''}
        CREADOR_ID: userid || ''
      };
      this.service.post(${lowercaseTableName}).subscribe(
        {
          next: (response) => {
            if (!response.data) {
              this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger')
              console.log(response.message);
            } else {
              this.openAlertModal(response.message, 'success')
              console.log(response.message);
              this.form.reset();
              this.router.navigate(['../'], { relativeTo: this.route });
            }
          },
          error: (error) => {
            this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger')
            console.log(error);;
          }
        }
      );
    }
  } else {
    this.form.markAllAsTouched();
  }
}

editar() {
  if (this.form.valid) {
    const ${lowercaseTableName}: ${capitalizedTableName} = {
      ${primaryKeyColumn}: this.elementoId,
      ${generatePropsComponentInstance(propertiesData)},
    };
    this.service.put(${lowercaseTableName}).subscribe(
      {
        next: (response) => {
          if (!response.data) {
            this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger')
            console.log(response.message);
          } else {
            this.openAlertModal(response.message, 'success')
            console.log(response.message);
          }

        },
        error: (errordata) => {
          this.openAlertModal('Ha ocurrido un error intente nuevamente.', 'danger')
          console.log(errordata);
        }
      }
    );
    // this.form.reset();
  } else {
    this.form.markAllAsTouched();
  }
}

loadData() {
  this.service.searchById(this.elementoId).subscribe({
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
  ${generatePropsComponentFormFill(propertiesData)}
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
  modalRef.componentInstance?.activeModal && (modalRef.componentInstance.contenido = (!this.modoEdicion) ? '¿Desea guardar profesor?' : '¿Desea editar profesor?');
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

async function main() {
  try {
    const [tables] = await baseDatos.execute<any>('SHOW TABLES');
    for (const table of tables) {
      const tableName = table[`Tables_in_${DB_DATABASE}`];
      const primaryKeyResult = await getPrimaryKey(baseDatos, tableName);
      let primaryKeyColumn = 'ID'; // Valor predeterminado

      if (primaryKeyResult && primaryKeyResult.length > 0) {
        primaryKeyColumn = primaryKeyResult[0].Column_name;
      }

     // await generateEntityFile(baseDatos, tableName, primaryKeyColumn);
      await generateInterfaceFile(baseDatos, tableName);
     // await generateNegocioFile(tableName, primaryKeyColumn);
      //await generateServiceFile(baseDatos, tableName);
      await generateComponentFile(baseDatos, tableName, primaryKeyColumn);
    }
    console.info('Archivos creados correctamente');
  } catch (error: any) {
    console.error('Error: ' + error.message);
  } finally {
    process.exit(); // Esto cerrará el programa después de que se complete la ejecución
  }
}

main();
