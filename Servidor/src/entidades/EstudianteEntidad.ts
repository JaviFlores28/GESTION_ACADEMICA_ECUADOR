class EstudianteEntidad {
  EST_ID: string;
  EST_DNI: string;
  EST_NOM: string;
  EST_NOM2: string;
  EST_APE: string;
  EST_APE2: string;
  EST_FECH_NAC: Date;
  EST_GEN: string;
  EST_PRV: string;
  EST_CAN: string;
  EST_PARR: string;
  EST_DIR: string;
  EST_NAC: string;
  EST_ETN: string;
  EST_NAC_ETN: string;
  EST_COM_ETN: string;
  EST_COD_ELE: string;
  EST_NEC_ASO_DIS: number;
  EST_NEC_NO_ASO_DIS: number;
  EST_ENF_CAT: number;
  EST_NUM_CONA: string;
  EST_INTE: number;
  EST_TV: number;
  EST_RAD: number;
  EST_PC: number;
  EST_CEL: number;
  REPR_ID: string;
  REL_EST_REP: string;
  ESTADO: number;

  constructor(EST_ID: string, EST_DNI: string, EST_NOM: string, EST_NOM2: string, EST_APE: string, EST_APE2: string, EST_FECH_NAC: Date, EST_GEN: string, EST_PRV: string, EST_CAN: string, EST_PARR: string, EST_DIR: string, EST_NAC: string, EST_ETN: string, EST_NAC_ETN: string, EST_COM_ETN: string, EST_COD_ELE: string, EST_NEC_ASO_DIS: number, EST_NEC_NO_ASO_DIS: number, EST_ENF_CAT: number, EST_NUM_CONA: string, EST_INTE: number, EST_TV: number, EST_RAD: number, EST_PC: number, EST_CEL: number, REPR_ID: string, REL_EST_REP: string, ESTADO: number) {
    this.EST_ID = EST_ID;
    this.EST_DNI = EST_DNI;
    this.EST_NOM = EST_NOM;
    this.EST_NOM2 = EST_NOM2;
    this.EST_APE = EST_APE;
    this.EST_APE2 = EST_APE2;
    this.EST_FECH_NAC = EST_FECH_NAC;
    this.EST_GEN = EST_GEN;
    this.EST_PRV = EST_PRV;
    this.EST_CAN = EST_CAN;
    this.EST_PARR = EST_PARR;
    this.EST_DIR = EST_DIR;
    this.EST_NAC = EST_NAC;
    this.EST_ETN = EST_ETN;
    this.EST_NAC_ETN = EST_NAC_ETN;
    this.EST_COM_ETN = EST_COM_ETN;
    this.EST_COD_ELE = EST_COD_ELE;
    this.EST_NEC_ASO_DIS = EST_NEC_ASO_DIS;
    this.EST_NEC_NO_ASO_DIS = EST_NEC_NO_ASO_DIS;
    this.EST_ENF_CAT = EST_ENF_CAT;
    this.EST_NUM_CONA = EST_NUM_CONA;
    this.EST_INTE = EST_INTE;
    this.EST_TV = EST_TV;
    this.EST_RAD = EST_RAD;
    this.EST_PC = EST_PC;
    this.EST_CEL = EST_CEL;
    this.REPR_ID = REPR_ID;
    this.REL_EST_REP = REL_EST_REP;
    this.ESTADO = ESTADO;
  }

  toArrayInsert(): any[] {
    return [this.EST_ID, this.EST_DNI, this.EST_NOM, this.EST_NOM2, this.EST_APE, this.EST_APE2, this.EST_FECH_NAC, this.EST_GEN, this.EST_PRV, this.EST_CAN, this.EST_PARR, this.EST_DIR, this.EST_NAC, this.EST_ETN, this.EST_NAC_ETN, this.EST_COM_ETN, this.EST_COD_ELE, this.EST_NEC_ASO_DIS, this.EST_NEC_NO_ASO_DIS, this.EST_ENF_CAT, this.EST_NUM_CONA, this.EST_INTE, this.EST_TV, this.EST_RAD, this.EST_PC, this.EST_CEL, this.REPR_ID, this.REL_EST_REP, this.ESTADO];
  }

  toArrayUpdate(): any[] {
    return [this.EST_DNI, this.EST_NOM, this.EST_NOM2, this.EST_APE, this.EST_APE2, this.EST_FECH_NAC, this.EST_GEN, this.EST_PRV, this.EST_CAN, this.EST_PARR, this.EST_DIR, this.EST_NAC, this.EST_ETN, this.EST_NAC_ETN, this.EST_COM_ETN, this.EST_COD_ELE, this.EST_NEC_ASO_DIS, this.EST_NEC_NO_ASO_DIS, this.EST_ENF_CAT, this.EST_NUM_CONA, this.EST_INTE, this.EST_TV, this.EST_RAD, this.EST_PC, this.EST_CEL, this.REPR_ID, this.REL_EST_REP, this.ESTADO, this.EST_ID];
  }
}

export default EstudianteEntidad;
