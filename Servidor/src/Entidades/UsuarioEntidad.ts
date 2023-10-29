import Funciones from "../Modelos/Funciones";
class Usuario {
  USR_ID: string;
    USR_DNI: string;
    USR_NOM: string;
    USR_NOM2: string;
    USR_APE: string;
    USR_APE2: string;
    USR_DIR: string;
    USR_TEL: string;
    USR_CEL: string;
    USR_EMAIL: string;
    USR_FECH_NAC: Date;
    USR_GEN: string;
    USUARIO: string;
    USR_PSWD: string;
    ROL_PRF: number;
    ROL_REPR: number;
    ROL_ADMIN: number;
    ESTADO: number;
    FECHA_CREACION?: Date | undefined;    
    constructor(USR_ID: string, USR_DNI: string, USR_NOM: string, USR_NOM2: string, USR_APE: string, USR_APE2: string, USR_DIR: string, USR_TEL: string, USR_CEL: string, USR_EMAIL: string, USR_FECH_NAC: Date, USR_GEN: string, ROL_PRF: number, ROL_REPR: number, ROL_ADMIN: number, ESTADO: number, FECHA_CREACION?: Date | undefined) {
       this.USR_ID = USR_ID;
      this.USR_DNI = USR_DNI;
      this.USR_NOM = USR_NOM;
      this.USR_NOM2 = USR_NOM2;
      this.USR_APE = USR_APE;
      this.USR_APE2 = USR_APE2;
      this.USR_DIR = USR_DIR;
      this.USR_TEL = USR_TEL;
      this.USR_CEL = USR_CEL;
      this.USR_EMAIL = USR_EMAIL;
      this.USR_FECH_NAC = USR_FECH_NAC;
      this.USR_GEN = USR_GEN;
      this.USUARIO = this.crearUsuario(USR_DNI, USR_NOM, USR_NOM2, USR_APE);
      this.USR_PSWD = Funciones.encrypt(USR_DNI);
      this.ROL_PRF = ROL_PRF;
      this.ROL_REPR = ROL_REPR;
      this.ROL_ADMIN = ROL_ADMIN;
      this.ESTADO = ESTADO;
      this.FECHA_CREACION = FECHA_CREACION;
    }
    
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

  const query = `INSERT INTO usuario (${propiedadesStr}) VALUES (${valoresStr});`;

  return { query, values: valores };
}

    
sqlUpdate(): { query: string; values: any[] } {
  const valoresStr: string[] = [];
  const valores: any[] = [];

  // Iterar sobre las propiedades del objeto
  Object.keys(this).forEach(propiedad => {
      const valor = this[propiedad as keyof this];

      if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'USR_ID' && propiedad !== 'CREADOR_ID' && propiedad!=='USR_PSWD' && propiedad!=='USUARIO'  && propiedad!=='ROL_ADMIN'  && propiedad!=='ROL_PRF'  && propiedad!=='ROL_REPR') {
          if (typeof valor === 'string') {
              valoresStr.push(`${propiedad} = ?`);
              valores.push(valor);
          } else if (valor instanceof Date) {
              const fecha = valor.toISOString().slice(0, 10);
              valoresStr.push(`${propiedad} = ?`);
              valores.push(fecha);
          } else {
              valoresStr.push(`${propiedad} = ?`);
              valores.push(valor);
          }
      }
  });
  valores.push(this.USR_ID);
  const query = `UPDATE usuario SET ${valoresStr.join(', ')} WHERE USR_ID = ?;`;
  return { query, values: valores };
}

    
isValid(): boolean {
  return !!this.USR_ID && !!this.USR_DNI && !!this.USR_NOM && !!this.USR_NOM2 && !!this.USR_APE && !!this.USR_APE2 && !!this.USR_DIR && !!this.USR_TEL && !!this.USR_CEL && !!this.USR_EMAIL && !!this.USR_FECH_NAC && !!this.USR_GEN;
}

    
crearUsuario(dni:string,nom:string,nom2:string,ape:string) {
  let usr = '';
  usr += nom[0] || ''; // Agregamos el primer carácter de nom1 si existe
  usr += nom2[0] || '';// Usa ?. para evitar problemas con valores null o undefined
  usr += ape|| '';
  usr += dni.substring(dni.length - 4); // Obtener los últimos 4 caracteres
  return usr;
}
}
export default Usuario;
