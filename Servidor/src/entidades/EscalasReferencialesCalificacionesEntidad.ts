class EscalasReferencialesCalificacionesEntidad {
  ESCL_ID: string;
  ESCL_ABRV: string;
  ESCL_DESCR: string;
  ESCL_INI: number;
  ESCL_FIN: number;

  constructor(ESCL_ID: string, ESCL_ABRV: string, ESCL_DESCR: string, ESCL_INI: number, ESCL_FIN: number) {
    this.ESCL_ID = ESCL_ID;
    this.ESCL_ABRV = ESCL_ABRV;
    this.ESCL_DESCR = ESCL_DESCR;
    this.ESCL_INI = ESCL_INI;
    this.ESCL_FIN = ESCL_FIN;
  }

  toArrayInsert(): any[] {
    return [this.ESCL_ID, this.ESCL_ABRV, this.ESCL_DESCR, this.ESCL_INI, this.ESCL_FIN];
  }

  toArrayUpdate(): any[] {
    return [this.ESCL_ABRV, this.ESCL_DESCR, this.ESCL_INI, this.ESCL_FIN, this.ESCL_ID];
  }
}

export default EscalasReferencialesCalificacionesEntidad;
