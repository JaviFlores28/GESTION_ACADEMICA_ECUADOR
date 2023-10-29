
class Matricula {
  MTR_ID: string;
    CRS_ID: string;
    EST_ID: string;
    ESTADO: number;
    PASE: string;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(MTR_ID: string, CRS_ID: string, EST_ID: string, ESTADO: number, PASE: string, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.MTR_ID = MTR_ID;
      this.CRS_ID = CRS_ID;
      this.EST_ID = EST_ID;
      this.ESTADO = ESTADO;
      this.PASE = PASE;
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

  const query = `INSERT INTO matricula (${propiedadesStr}) VALUES (${valoresStr});`;

  return { query, values: valores };
}

    
sqlUpdate(): { query: string; values: any[] } {
  const valoresStr: string[] = [];
  const valores: any[] = [];

  // Iterar sobre las propiedades del objeto
  Object.keys(this).forEach(propiedad => {
      const valor = this[propiedad as keyof this];

      if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'MTR_ID' && propiedad !== 'CREADOR_ID' ) {
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
  valores.push(this.MTR_ID);
  const query = `UPDATE matricula SET ${valoresStr.join(', ')} WHERE MTR_ID = ?;`;
  return { query, values: valores };
}

    
isValid(): boolean {
  return !!this.MTR_ID && !!this.CRS_ID && !!this.EST_ID && !!this.PASE && !!this.CREADOR_ID;
}

    
}
export default Matricula;
