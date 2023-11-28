import BaseDatos from './sistema/conexion/BaseDatos';

async function main() {
  BaseDatos.createDatabase()
    .then(() => {
      BaseDatos.defaultData();
    })
    .finally(() => {
      process.exit();
    });
}

main();

/* 
 

static 

static 

static generatePropsIsValid(propertiesData: MappedProperty[], excludedProperties: string[]) {
  return propertiesData
    .filter((property) => !excludedProperties.includes(property.name))
    .map((property) => `!!this.${property.name}`)
    .join(' && ');
}



*/
