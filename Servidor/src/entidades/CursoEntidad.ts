class CursoEntidad {
  CRS_ID: string;
  CRS_NOM: string;
  CRS_TIPO: string;
  CRS_ORDEN: number;
  ESTADO: number;
  CREADOR_ID: string;

  constructor(CRS_ID: string, CRS_NOM: string, CRS_TIPO: string, CRS_ORDEN: number, ESTADO: number, CREADOR_ID: string) {
    this.CRS_ID = CRS_ID;
    this.CRS_NOM = CRS_NOM;
    this.CRS_TIPO = CRS_TIPO;
    this.CRS_ORDEN = CRS_ORDEN;
    this.ESTADO = ESTADO;
    this.CREADOR_ID = CREADOR_ID;
  }

  toArrayInsert(): any[] {
    return [this.CRS_ID, this.CRS_NOM, this.CRS_TIPO, this.CRS_ORDEN, this.ESTADO, this.CREADOR_ID];
  }

  toArrayUpdate(): any[] {
    return [this.CRS_NOM, this.CRS_TIPO, this.CRS_ORDEN, this.ESTADO, this.CRS_ID];
  }
}

export default CursoEntidad;
