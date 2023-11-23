-- Estructura de tabla para la tabla USUARIO-ADMIN-REPRESENTANTE
CREATE TABLE IF NOT EXISTS USUARIO (
  USR_ID CHAR(36) NOT NULL PRIMARY KEY,
  USR_DNI VARCHAR(10) NOT NULL UNIQUE,
  USR_NOM VARCHAR(30) NOT NULL,
  USR_NOM2 VARCHAR(30) NOT NULL,
  USR_APE VARCHAR(30) NOT NULL,
  USR_APE2 VARCHAR(30) NOT NULL,
  USR_DIR VARCHAR(300) NOT NULL,
  USR_TEL VARCHAR(10) NOT NULL,
  USR_CEL VARCHAR(10) NOT NULL,
  USR_EMAIL VARCHAR(100) NOT NULL,
  USR_FECH_NAC DATE NOT NULL,
  USR_GEN char(1) NOT NULL,
  USUARIO VARCHAR(30) NOT NULL UNIQUE,
  USR_PSWD VARCHAR(300) NOT NULL,
  ROL_PRF TINYINT (1) NOT NULL CHECK (ROL_PRF IN (0, 1)),
  ROL_REPR TINYINT (1) NOT NULL CHECK (ROL_REPR IN (0, 1)),
  ROL_ADMIN TINYINT (1) NOT NULL CHECK (ROL_ADMIN IN (0, 1)),
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp()
);

-- Estructura de tabla para la tabla PROFESOR
CREATE TABLE IF NOT EXISTS USUARIO_PROFESOR (
  DTLL_PRF_ID CHAR(36) NOT NULL PRIMARY KEY,
  PRF_FECH_INGR_INST DATE NOT NULL,
  PRF_FECH_INGR_MAG DATE NOT NULL,
  USR_ID CHAR(36) NOT NULL,
  FOREIGN KEY (USR_ID) REFERENCES USUARIO (USR_ID) ON DELETE CASCADE
);

-- Estructura de tabla para la tabla ESTUDIANTE
CREATE TABLE IF NOT EXISTS ESTUDIANTE (
  EST_ID CHAR(36) NOT NULL PRIMARY KEY,
  EST_DNI VARCHAR(10) NOT NULL UNIQUE,
  EST_NOM VARCHAR(100) NOT NULL,
  EST_NOM2 VARCHAR(100) NOT NULL,
  EST_APE VARCHAR(100) NOT NULL,
  EST_APE2 VARCHAR(100) NOT NULL,
  EST_FECH_NAC DATE NOT NULL,
  EST_GEN char(1) NOT NULL,
  EST_PRV VARCHAR(50) NOT NULL,
  EST_CAN VARCHAR(50) NOT NULL,
  EST_PARR VARCHAR(50) NOT NULL,
  EST_DIR VARCHAR(150) NOT NULL,
  EST_NAC VARCHAR(50) NOT NULL,
  EST_ETN VARCHAR(50) NOT NULL,
  EST_NAC_ETN VARCHAR(50) NOT NULL,
  EST_COM_ETN VARCHAR(50) NOT NULL,
  EST_COD_ELE VARCHAR(15) NOT NULL,
  EST_NEC_ASO_DIS TINYINT (1) NOT NULL CHECK (EST_NEC_ASO_DIS IN (0, 1)),
  EST_NEC_NO_ASO_DIS TINYINT (1) NOT NULL CHECK (EST_NEC_NO_ASO_DIS IN (0, 1)),
  EST_ENF_CAT TINYINT (1) NOT NULL CHECK (EST_ENF_CAT IN (0, 1)),
  EST_NUM_CONA VARCHAR(10) NOT NULL,
  EST_INTE TINYINT (1) NOT NULL CHECK (EST_INTE IN (0, 1)),
  EST_TV TINYINT (1) NOT NULL CHECK (EST_TV IN (0, 1)),
  EST_RAD TINYINT (1) NOT NULL CHECK (EST_RAD IN (0, 1)),
  EST_PC TINYINT (1) NOT NULL CHECK (EST_PC IN (0, 1)),
  EST_CEL TINYINT (1) NOT NULL CHECK (EST_CEL IN (0, 1)),
  REPR_ID CHAR(36) NOT NULL,
  REL_EST_REP VARCHAR(50) NOT NULL,
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
  FOREIGN KEY (REPR_ID) REFERENCES USUARIO (USR_ID)
);

-- Estructura de tabla para la tabla CURSO
CREATE TABLE IF NOT EXISTS CURSO (
  CRS_ID CHAR(36) NOT NULL PRIMARY KEY,
  CRS_NOM VARCHAR(10) NOT NULL UNIQUE,
  CRS_TIPO VARCHAR(10) NOT NULL,
  CRS_ORDEN int (11) NOT NULL,
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
  UNIQUE(CRS_TIPO,CRS_ORDEN)
);

-- Estructura de tabla para la tabla AREA
CREATE TABLE IF NOT EXISTS AREA (
  AREA_ID CHAR(36) NOT NULL PRIMARY KEY,
  AREA_NOM VARCHAR(300) NOT NULL UNIQUE,
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID)
);

-- Estructura de tabla para la tabla ASIGNATURA-CURSO
CREATE TABLE IF NOT EXISTS ASIGNATURA (
  ASG_ID CHAR(36) NOT NULL PRIMARY KEY,
  ASG_NOM VARCHAR(50) NOT NULL UNIQUE,
  ASG_TIPO ENUM('CUALITATIVA', 'CUANTITATIVA') NOT NULL,
  AREA_ID CHAR(36) NOT NULL,
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
  FOREIGN KEY (AREA_ID) REFERENCES AREA (AREA_ID)
);

-- Estructura de tabla para la tabla ANIO_LECTIVO
CREATE TABLE IF NOT EXISTS ANIO_LECTIVO (
  AL_ID CHAR(36) NOT NULL PRIMARY KEY,
  AL_NOM VARCHAR(30) NOT NULL UNIQUE,
  AL_INICIO DATE NOT NULL,
  AL_FIN DATE NOT NULL,
  AL_POR_PRD INT NOT NULL,
  AL_POR_EXAM INT NOT NULL,
  CLFN_MIN_APR FLOAT NOT NULL,
  CLFN_MIN_PERD FLOAT NOT NULL,
  NUM_PRD INT NOT NULL,
  NUM_EXAM INT NOT NULL,
  NUM_PRCL INT NOT NULL,
  NUM_SUSP INT NOT NULL,
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
  UNIQUE(AL_INICIO,AL_FIN)
);

-- Estructura de tabla para la tabla PARALELO
CREATE TABLE IF NOT EXISTS PARALELO (
  PRLL_ID CHAR(36) NOT NULL PRIMARY KEY,
  PRLL_NOM VARCHAR(100) NOT NULL UNIQUE,
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID)
  );

-- Estructura de tabla para ESTUDIANTE_CURSO_PARALELO
CREATE TABLE IF NOT EXISTS ESTUDIANTE_CURSO (
    EST_CRS_ID CHAR(36) NOT NULL PRIMARY KEY,
    EST_ID CHAR(36) NOT NULL,
    CRS_ID CHAR(36) NOT NULL,
    ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
    CREADOR_ID CHAR(36) NOT NULL,
    FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (EST_ID) REFERENCES ESTUDIANTE(EST_ID),
    FOREIGN KEY (CRS_ID) REFERENCES CURSO(CRS_ID),
    FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
    UNIQUE (EST_ID,CRS_ID)
);

-- Estructura de tabla para ESTUDIANTE_CURSO_PARALELO
CREATE TABLE IF NOT EXISTS ESTUDIANTE_CURSO_PARALELO (
    EST_CRS_PRLL_ID CHAR(36) NOT NULL PRIMARY KEY,
    EST_CRS_ID CHAR(36) NOT NULL,
    AL_ID CHAR(36) NOT NULL,
    PRLL_ID CHAR(36) NOT NULL,
    PASE ENUM('Aprobado', 'Reprobado','Suspenso','En proceso','Retirado') NOT NULL,
    ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
    CREADOR_ID CHAR(36) NOT NULL,
    FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (EST_CRS_ID) REFERENCES ESTUDIANTE_CURSO(EST_CRS_ID),
    FOREIGN KEY (AL_ID) REFERENCES ANIO_LECTIVO(AL_ID),
    FOREIGN KEY (PRLL_ID) REFERENCES PARALELO(PRLL_ID),
    FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
    UNIQUE (EST_CRS_ID, AL_ID, PRLL_ID)
);

-- Estructura de tabla para PROFESOR_ASIGNATURA_PARALELO
CREATE TABLE IF NOT EXISTS PROFESOR_ASIGNATURA_PARALELO (
    PRF_ASG_PRLL_ID CHAR(36) NOT NULL PRIMARY KEY,
    PRF_ID CHAR(36) NOT NULL,
    AL_ID CHAR(36) NOT NULL,
    ASG_ID CHAR(36) NOT NULL,
    CRS_ID CHAR(36) NOT NULL,
    PRLL_ID CHAR(36) NOT NULL,
    ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
    CREADOR_ID CHAR(36) NOT NULL,
    FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
    FOREIGN KEY (PRF_ID) REFERENCES USUARIO(USR_ID),
    FOREIGN KEY (AL_ID) REFERENCES ANIO_LECTIVO(AL_ID),
    FOREIGN KEY (ASG_ID) REFERENCES ASIGNATURA(ASG_ID),
    FOREIGN KEY (CRS_ID) REFERENCES CURSO(CRS_ID),
    FOREIGN KEY (PRLL_ID) REFERENCES PARALELO(PRLL_ID),
    FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
    UNIQUE (PRF_ID, AL_ID, ASG_ID,CRS_ID, PRLL_ID)
);

-- Estructura de tabla para la tabla PERIODOS
CREATE TABLE IF NOT EXISTS PERIODO (
  PRD_ID CHAR(36) NOT NULL PRIMARY KEY,
  PRD_NOM VARCHAR(10) NOT NULL,
  PRD_TIPO enum('Normal', 'Suspenso') NOT NULL,
  AL_ID CHAR(36) NOT NULL,
  ESTADO enum('Activo', 'Inactivo', 'Cerrado', 'Habilitado') NOT NULL,
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
  FOREIGN KEY (AL_ID) REFERENCES ANIO_LECTIVO (AL_ID)
);

-- Estructura de tabla para la tabla PARICIALES
CREATE TABLE IF NOT EXISTS PARCIAL (
  PRCL_ID CHAR(36) NOT NULL PRIMARY KEY,
  PRCL_NOM VARCHAR(10) NOT NULL,
  PRCL_INI DATE NOT NULL,
  PRCL_FIN DATE NOT NULL,
  ESTADO enum('Activo', 'Inactivo', 'Cerrado', 'Habilitado') NOT NULL,
  PRCL_TIPO enum('Normal', 'Evaluativo') NOT NULL,
  PRD_ID CHAR(36) NOT NULL,
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
  FOREIGN KEY (PRD_ID) REFERENCES PERIODO (PRD_ID)
);

-- Estructura de tabla para la tabla CALIFICACIONES PARICIALES
CREATE TABLE IF NOT EXISTS CALIFICACIONES_CUANTITATIVAS (
  CAL_ID CHAR(36) NOT NULL PRIMARY KEY,
  PRF_ASG_PRLL_ID CHAR(36) NOT NULL,
  EST_CRS_PRLL_ID CHAR(36) NOT NULL,
  PRCL_ID CHAR(36) NOT NULL,
  CALIFICACION DECIMAL(4, 2) NOT NULL,
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
  FOREIGN KEY (PRF_ASG_PRLL_ID) REFERENCES PROFESOR_ASIGNATURA_PARALELO (PRF_ASG_PRLL_ID),
  FOREIGN KEY (EST_CRS_PRLL_ID) REFERENCES ESTUDIANTE_CURSO_PARALELO (EST_CRS_PRLL_ID),
  FOREIGN KEY (PRCL_ID) REFERENCES PARCIAL (PRCL_ID),
  UNIQUE(PRF_ASG_PRLL_ID,EST_CRS_PRLL_ID,PRCL_ID)
);

-- Estructura de tabla para la tabla CALIFICACIONES PERIODOS
CREATE TABLE IF NOT EXISTS CALIFICACIONES_CUALITATIVAS (
  CAL_ID CHAR(36) NOT NULL PRIMARY KEY,
  PRF_ASG_PRLL_ID CHAR(36) NOT NULL,
  EST_CRS_PRLL_ID CHAR(36) NOT NULL,
  PRD_ID CHAR(36) NOT NULL,
  CALIFICACION CHAR(1) NOT NULL,
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
  FOREIGN KEY (PRF_ASG_PRLL_ID) REFERENCES PROFESOR_ASIGNATURA_PARALELO (PRF_ASG_PRLL_ID),
  FOREIGN KEY (EST_CRS_PRLL_ID) REFERENCES ESTUDIANTE_CURSO_PARALELO (EST_CRS_PRLL_ID),
  FOREIGN KEY (PRD_ID) REFERENCES PERIODO (PRD_ID),
  UNIQUE(PRF_ASG_PRLL_ID,EST_CRS_PRLL_ID,PRD_ID)
);

-- Estructura de tabla para la tabla PARAMETRO
CREATE TABLE IF NOT EXISTS PARAMETRO (
  PRMT_ID CHAR(36) NOT NULL PRIMARY KEY,
  PRMT_NOM VARCHAR(100) NOT NULL,
  PRMT_DESCR VARCHAR(300) NOT NULL,
  PRMT_URL_IMG VARCHAR(500) NOT NULL,
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID)
);

CREATE VIEW IF NOT EXISTS  VISTA_ESTUDIANTE AS SELECT
    E.EST_ID,
    E.EST_DNI,
    CONCAT(E.EST_NOM, ' ', E.EST_NOM2, ' ', E.EST_APE, ' ', E.EST_APE2) AS EST_NOM,
    CONCAT(U.USR_NOM, ' ', U.USR_NOM2, ' ', U.USR_APE, ' ', U.USR_APE2) AS REPR_ID,
    E.ESTADO
FROM 
    ESTUDIANTE AS E
JOIN 
    USUARIO AS U ON E.REPR_ID = U.USR_ID;


CREATE VIEW IF NOT EXISTS  VISTA_USUARIO AS SELECT
    E.USR_ID,
    E.USR_DNI,
    CONCAT(E.USR_NOM, ' ', E.USR_NOM2, ' ', E.USR_APE, ' ', E.USR_APE2) AS USR_NOM,
    E.USUARIO,
    E.USR_EMAIL,
    E.ROL_ADMIN,
    E.ROL_PRF,
    E.ROL_REPR,
    E.ESTADO
FROM 
    USUARIO AS E
    ORDER BY E.ESTADO DESC;


CREATE VIEW IF NOT EXISTS  vista_estudiante_curso AS SELECT a.EST_CRS_ID, b.EST_DNI, CONCAT(b.EST_NOM, ' ', b.EST_NOM2, ' ', b.EST_APE, ' ', b.EST_APE2) AS EST_ID, CONCAT( c.CRS_NOM, ' - ',C.CRS_TIPO) AS CRS_ID,A.ESTADO FROM `estudiante_curso` AS A JOIN estudiante as b on b.EST_ID=a.EST_ID join curso as c on c.CRS_ID=a.CRS_ID  
ORDER BY `A`.`ESTADO` ASC;
