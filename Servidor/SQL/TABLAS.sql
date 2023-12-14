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
  PRD_NOM VARCHAR(30) NOT NULL,
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
    ASG_ID CHAR(36) NOT NULL,
    PRF_ID CHAR(36) NOT NULL,
    AL_ID CHAR(36) NOT NULL,
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
    UNIQUE (AL_ID, ASG_ID,CRS_ID, PRLL_ID)
);

-- Estructura de tabla para la tabla PERIODOS
CREATE TABLE IF NOT EXISTS PERIODO (
  PRD_ID CHAR(36) NOT NULL PRIMARY KEY,
  PRD_NOM VARCHAR(10) NOT NULL,
  PRD_INI DATE NOT NULL,
  PRD_FIN DATE NOT NULL,
  PRD_TIPO enum('Normal', 'Suspenso') NOT NULL,
  AL_ID CHAR(36) NOT NULL,
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
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
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
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

CREATE TABLE IF NOT EXISTS ESCALAS_REFERENCIALES_CALIFICACIONES (
    ESCL_ID CHAR(36) NOT NULL PRIMARY KEY,
    ESCL_ABRV CHAR(2) NOT NULL,
    ESCL_DESCR VARCHAR(255) NOT NULL,
    ESCL_INI DECIMAL(5, 2) NOT NULL,
    ESCL_FIN DECIMAL(5, 2) NOT NULL,
    ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1))
);

CREATE VIEW IF NOT EXISTS  VISTA_ESTUDIANTE AS SELECT
    E.EST_ID,
    E.EST_DNI,
    CONCAT(E.EST_APE, ' ', E.EST_APE2, ' ', E.EST_NOM, ' ', E.EST_NOM2) AS EST_NOM,
    CONCAT(U.USR_APE, ' ', U.USR_APE2,' ', U.USR_NOM, ' ', U.USR_NOM2) AS USR_NOM,
    E.ESTADO
FROM 
    ESTUDIANTE AS E
JOIN 
    USUARIO AS U ON E.REPR_ID = U.USR_ID
    ORDER BY E.ESTADO DESC;


CREATE VIEW IF NOT EXISTS  VISTA_USUARIO AS SELECT
    E.USR_ID,
    E.USR_DNI,
    CONCAT(E.USR_APE, ' ', E.USR_APE2, ' ', E.USR_NOM, ' ', E.USR_NOM2 ) AS USR_NOM,
    E.USUARIO,
    E.USR_EMAIL,
    E.ROL_ADMIN,
    E.ROL_PRF,
    E.ROL_REPR,
    E.ESTADO
FROM 
    USUARIO AS E
    ORDER BY E.ESTADO DESC;


CREATE VIEW IF NOT EXISTS VISTA_ESTUDIANTE_CURSO AS 
SELECT 
  A.EST_CRS_ID, 
  B.EST_DNI, 
  CONCAT(B.EST_APE, ' ', B.EST_APE2,' ', B.EST_NOM, ' ', B.EST_NOM2 ) AS EST_NOM, 
  C.CRS_NOM,
  C.CRS_TIPO,
  A.ESTADO
FROM 
  ESTUDIANTE_CURSO AS A
  JOIN ESTUDIANTE AS B ON B.EST_ID = A.EST_ID 
  JOIN CURSO AS C ON C.CRS_ID = A.CRS_ID  
ORDER BY 
  A.FECHA_CREACION DESC;


CREATE VIEW IF NOT EXISTS VISTA_ESTUDIANTE_CURSO_PARALELO AS
SELECT 
  ECP.EST_CRS_PRLL_ID, 
  E.EST_DNI,
  CONCAT(E.EST_APE, ' ', E.EST_APE2, ' ', E.EST_NOM, ' ', E.EST_NOM2) AS EST_CRS_NOM, 
  C.CRS_NOM, 
  C.CRS_TIPO, 
  P.PRLL_NOM, 
  AL.AL_NOM, 
  ECP.PASE, 
  ECP.ESTADO
FROM 
  ESTUDIANTE_CURSO_PARALELO ECP 
  INNER JOIN ESTUDIANTE_CURSO EC ON ECP.EST_CRS_ID = EC.EST_CRS_ID 
  INNER JOIN ESTUDIANTE E ON EC.EST_ID = E.EST_ID 
  INNER JOIN ANIO_LECTIVO AL ON ECP.AL_ID = AL.AL_ID 
  INNER JOIN PARALELO P ON ECP.PRLL_ID = P.PRLL_ID 
  INNER JOIN CURSO C ON EC.CRS_ID = C.CRS_ID
ORDER BY 
  ECP.FECHA_CREACION DESC; 


CREATE VIEW IF NOT EXISTS VISTA_PROFESOR_ASIGNATURA_PARALELO AS
SELECT
  PAP.PRF_ASG_PRLL_ID,
  CONCAT(U.USR_APE, ' ', U.USR_APE2, ' ', U.USR_NOM, ' ', U.USR_NOM2 ) AS PRF_NOM,
  AL.AL_NOM AS AL_NOM,
  A.ASG_NOM AS ASG_NOM,
  C.CRS_NOM AS CRS_NOM,
  C.CRS_TIPO AS CRS_TIPO,
  P.PRLL_NOM AS PRLL_NOM,
  PAP.ESTADO
FROM
  PROFESOR_ASIGNATURA_PARALELO PAP
  INNER JOIN USUARIO U ON PAP.PRF_ID = U.USR_ID
  INNER JOIN ANIO_LECTIVO AL ON PAP.AL_ID = AL.AL_ID
  INNER JOIN ASIGNATURA A ON PAP.ASG_ID = A.ASG_ID
  INNER JOIN CURSO C ON PAP.CRS_ID = C.CRS_ID
  INNER JOIN PARALELO P ON PAP.PRLL_ID = P.PRLL_ID
ORDER BY C.CRS_ORDEN ASC, P.PRLL_NOM ASC;
