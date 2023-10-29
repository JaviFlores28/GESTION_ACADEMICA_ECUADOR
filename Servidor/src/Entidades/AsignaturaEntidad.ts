
class Asignatura {
  ASG_ID: string;
    ASG_NOM: string;
    ASG_TIPO: string;
    AREA_ID: string;
    CRS_ID: string;
    ESTADO: number;
    CREADOR_ID: string;
    FECHA_CREACION?: Date | undefined;    
    constructor(ASG_ID: string, ASG_NOM: string, ASG_TIPO: string, AREA_ID: string, CRS_ID: string, ESTADO: number, CREADOR_ID: string, FECHA_CREACION?: Date | undefined) {
       this.ASG_ID = ASG_ID;
      this.ASG_NOM = ASG_NOM;
      this.ASG_TIPO = ASG_TIPO;
      this.AREA_ID = AREA_ID;
      this.CRS_ID = CRS_ID;
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

  const query = `INSERT INTO asignatura (${propiedadesStr}) VALUES (${valoresStr});`;

  return { query, values: valores };
}

    
sqlUpdate(): { query: string; values: any[] } {
  const valoresStr: string[] = [];
  const valores: any[] = [];

  // Iterar sobre las propiedades del objeto
  Object.keys(this).forEach(propiedad => {
      const valor = this[propiedad as keyof this];

      if (valor !== undefined && propiedad !== 'FECHA_CREACION' && propiedad !== 'ASG_ID' && propiedad !== 'CREADOR_ID' ) {
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
  valores.push(this.ASG_ID);
  const query = `UPDATE asignatura SET ${valoresStr.join(', ')} WHERE ASG_ID = ?;`;
  return { query, values: valores };
}

    
isValid(): boolean {
  return !!this.ASG_ID && !!this.ASG_NOM && !!this.ASG_TIPO && !!this.AREA_ID && !!this.CRS_ID && !!this.CREADOR_ID;
}

    
}
export default Asignatura;
