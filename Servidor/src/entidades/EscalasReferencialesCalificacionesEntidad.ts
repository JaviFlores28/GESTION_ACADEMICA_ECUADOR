
class EscalasReferencialesCalificacionesEntidad {
  ESCL_ID: string;
  ESCL_ABRV: string;
  ESCL_DESCR: string;
  ESCL_INI: number;
  ESCL_FIN: number;
  ESTADO: number;

  constructor(ESCL_ID: string, ESCL_ABRV: string, ESCL_DESCR: string, ESCL_INI: number, ESCL_FIN: number, ESTADO: number) {
    this.ESCL_ID = ESCL_ID;
    this.ESCL_ABRV = ESCL_ABRV;
    this.ESCL_DESCR = ESCL_DESCR;
    this.ESCL_INI = ESCL_INI;
    this.ESCL_FIN = ESCL_FIN;
    this.ESTADO = ESTADO;
  }

  toArrayInsert(): any[] {
    return [this.ESCL_ID, this.ESCL_ABRV, this.ESCL_DESCR, this.ESCL_INI, this.ESCL_FIN, this.ESTADO];
  }

  toArrayUpdate(): any[] {
    return [this.ESCL_ABRV, this.ESCL_DESCR, this.ESCL_INI, this.ESCL_FIN, this.ESTADO, this.ESCL_ID];
  }
}

export default EscalasReferencialesCalificacionesEntidad;
