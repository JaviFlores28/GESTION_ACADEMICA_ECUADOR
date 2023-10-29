
class DetalleUsuarioProfesor {
  DTLL_PRF_ID: string;
    PRF_FECH_INGR_INST: Date;
    PRF_FECH_INGR_MAG: Date;
    USR_ID: string;    
    constructor(DTLL_PRF_ID: string, PRF_FECH_INGR_INST: Date, PRF_FECH_INGR_MAG: Date, USR_ID: string) {
       this.DTLL_PRF_ID = DTLL_PRF_ID;
      this.PRF_FECH_INGR_INST = PRF_FECH_INGR_INST;
      this.PRF_FECH_INGR_MAG = PRF_FECH_INGR_MAG;
      this.USR_ID = USR_ID;
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

  const query = `INSERT INTO detalle_usuario_profesor (${propiedadesStr}) VALUES (${valoresStr});`;

  return { query, values: valores };
}

    
sqlUpdate(): { query: string; values: any[] } {
  const valoresStr: string[] = [];
  const valores: any[] = [];

  // Iterar sobre las propiedades del objeto
  Object.keys(this).forEach(propiedad => {
      const valor = this[propiedad as keyof this];

      if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'DTLL_PRF_ID' && propiedad !== 'USR_ID' && propiedad !== 'CREADOR_ID' ) {
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
  valores.push(this.DTLL_PRF_ID);
  const query = `UPDATE detalle_usuario_profesor SET ${valoresStr.join(', ')} WHERE USR_ID = ?;`;
  return { query, values: valores };
}

    
isValid(): boolean {
  return !!this.DTLL_PRF_ID && !!this.PRF_FECH_INGR_INST && !!this.PRF_FECH_INGR_MAG && !!this.USR_ID;
}

    
}
export default DetalleUsuarioProfesor;
