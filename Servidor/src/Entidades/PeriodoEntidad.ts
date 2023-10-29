
class Periodo {
  PRD_ID: string;
    PRD_NOM: string;
    PRD_TIPO: string;
    AL_ID: string;
    ESTADO: string;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(PRD_ID: string, PRD_NOM: string, PRD_TIPO: string, AL_ID: string, ESTADO: string, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.PRD_ID = PRD_ID;
      this.PRD_NOM = PRD_NOM;
      this.PRD_TIPO = PRD_TIPO;
      this.AL_ID = AL_ID;
      this.ESTADO = ESTADO;
      this.CREADOR_ID = CREADOR_ID;
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

  const query = `INSERT INTO periodo (${propiedadesStr}) VALUES (${valoresStr});`;

  return { query, values: valores };
}

    
sqlUpdate(): { query: string; values: any[] } {
  const valoresStr: string[] = [];
  const valores: any[] = [];

  // Iterar sobre las propiedades del objeto
  Object.keys(this).forEach(propiedad => {
      const valor = this[propiedad as keyof this];

      if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'PRD_ID' && propiedad !== 'CREADOR_ID' ) {
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
  valores.push(this.PRD_ID);
  const query = `UPDATE periodo SET ${valoresStr.join(', ')} WHERE PRD_ID = ?;`;
  return { query, values: valores };
}

    
isValid(): boolean {
  return !!this.PRD_ID && !!this.PRD_NOM && !!this.PRD_TIPO && !!this.AL_ID && !!this.CREADOR_ID;
}

    
}
export default Periodo;
