
--INSERTS
INSERT INTO
  `USUARIO` (
    `USUARIO_ID`,
    `USUARIO_DNI`,
    `USUARIO_NOMBREBRE`,
    `USUARIO_NOMBREBRE2`,
    `USUARIO_APELLIDO`,
    `USUARIO_APELLIDO2`,
    `USUARIO_DIRECCION`,
    `USUARIO_TELEFONO`,
    `USUARIO_CELULAR`,
    `USUARIO_CORREO`,
    `USUARIO`,
    `ROL_PROFESOR`,
    `ROL_REPRESENTANTE`,
    `ROL_ADMINISTRADOR`,
    `USUARIO_PSWD`
  )
VALUES
  (
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '1',
    '0',
    '0',
    '0',
    '1'
  );


  INSERT INTO `USUARIO` (`USUARIO_ID`, `USUARIO_DNI`, `USUARIO_NOMBRE`, `USUARIO_NOMBRE2`, `USUARIO_APELLIDO`, `USUARIO_APELLIDO2`, `USUARIO_DIRECCION`, `USUARIO_TELEFONO`, `USUARIO_CELULAR`, `USUARIO_CORREO`, `USUARIO_FECH_NAC`, `USUARIO_GENERO`, `USUARIO`, `USUARIO_PSWD`, `ROL_PROFESOR`, `ROL_REPRESENTANTE`, `ROL_ADMINISTRADOR`, `FECHA_CREACION`, `ESTADO`) VALUES ('1', '1', '1', '1', '1', '1', '1', '1', '1', '1', '2023-10-11', '1', '1', '1', '0', '0', '0', CURRENT_TIMESTAMP, 'Activo')

--POSIBLES
-- Estructura de tabla para la tabla `REPRESENTANTE`
CREATE TABLE `REPRESENTANTE` (
  `REPRESENTANTE_ID` int NOT NULL PRIMARY KEY,
  `USUARIO_ID` varchar(36) NOT NULL,
  `ESTADO` enum ('Activo', 'Inactivo') NOT NULL,
  `USUARIO_CREADOR_ID` varchar(36) NOT NULL,
  `FECHA_CREACION` datetime NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (`USUARIO_CREADOR_ID`) REFERENCES `USUARIO` (`USUARIO_ID`),
  FOREIGN KEY (`USUARIO_ID`) REFERENCES `USUARIO` (`USUARIO_ID`)
);

------ creacion de periodos y subperiodos


DELIMITER $$
CREATE TRIGGER `tr_estado_anio_lectivo` AFTER UPDATE ON `anio_lectivo` FOR EACH ROW BEGIN IF NEW.AL_ESTADO = 'I'
    AND OLD.AL_ESTADO = 'A' THEN -- Actualizar el estado de los periodos relacionados
UPDATE periodo
SET PRD_ESTADO = 'C'
WHERE AL_ID = NEW.AL_ID;
-- Actualizar el estado de los subperiodos relacionados
UPDATE subperiodo
SET SPRD_ESTADO = 'C'
WHERE PRD_ID IN (
        SELECT PRD_ID
        FROM periodo
        WHERE AL_ID = NEW.AL_ID
    );
END IF;
IF NEW.AL_ESTADO = 'A'
AND OLD.AL_ESTADO = 'I' THEN -- Actualizar el estado de los periodos relacionados a 'A'
UPDATE periodo
SET PRD_ESTADO = 'A'
WHERE AL_ID = NEW.AL_ID;
-- Actualizar el estado de los subperiodos relacionados a 'A'
UPDATE subperiodo
SET SPRD_ESTADO = 'I'
WHERE PRD_ID IN (
        SELECT PRD_ID
        FROM periodo
        WHERE AL_ID = NEW.AL_ID
    );
END IF;
END
$$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER evitar_eliminacion
BEFORE DELETE ON usuarios
FOR EACH ROW
BEGIN
  IF OLD.no_eliminable = 1 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'No puedes eliminar este registro.';
  END IF;
END$$
DELIMITER ;



CREATE VIEW VistaNotasEstudiante AS
SELECT f.NombreEstudiante, d.NombreAsignatura, C.ProfesoresAsignaturasParaleloID, C.EstudianteCursoParaleloID, MAX(CASE WHEN C.ParcialID = 1 THEN C.Nota END) AS Parcial1, MAX(CASE WHEN C.ParcialID = 2 THEN C.Nota END) AS Parcial2, MAX(CASE WHEN C.ParcialID = 3 THEN C.Nota END) AS Parcial3, SUM(C.Nota)/3 AS SumaNotas FROM Calificaciones AS C JOIN estudiantescursosparalelos AS e ON C.EstudianteCursoParaleloID = e.EstudianteCursoParaleloID JOIN estudiantes AS f ON e.EstudianteID = f.EstudianteID JOIN profesoresasignaturasparalelos AS b ON C.ProfesoresAsignaturasParaleloID = b.ProfesoresAsignaturasParaleloID JOIN asignaturas AS d ON b.AsignaturaID = d.AsignaturaID GROUP BY C.ProfesoresAsignaturasParaleloID;

SELECT *
FROM VistaNotasEstudiante
JOIN estudiantescursosparalelos AS b ON VistaNotasEstudiante.EstudianteCursoParaleloID = b.EstudianteCursoParaleloID
WHERE b.CursoID = 1;

CREATE TABLE Estudiantes (
    EstudianteID INT PRIMARY KEY,
    NombreEstudiante VARCHAR(50)
);
CREATE TABLE AniosLectivos (
    AnioLectivoID INT PRIMARY KEY,
    NombreAnioLectivo VARCHAR(50)
);

CREATE TABLE Profesores (
    ProfesorID INT PRIMARY KEY,
    NombreProfesor VARCHAR(50)
);

CREATE TABLE Paralelos (
    ParaleloID INT PRIMARY KEY,
    NombreParalelo VARCHAR(10)
);

CREATE TABLE Asignaturas (
    AsignaturaID INT PRIMARY KEY,
    NombreAsignatura VARCHAR(50)
);

CREATE TABLE Cursos (
    CursoID INT PRIMARY KEY,
    NombreCurso VARCHAR(50)
);

CREATE TABLE EstudiantesCursosParalelos (
    EstudianteCursoParaleloID INT PRIMARY KEY,
    EstudianteID INT,
    AnioLectivoID INT,
    CursoID INT,
    ParaleloID INT,
    FOREIGN KEY (EstudianteID) REFERENCES Estudiantes(EstudianteID),
    FOREIGN KEY (AnioLectivoID) REFERENCES AniosLectivos(AnioLectivoID),
    FOREIGN KEY (CursoID) REFERENCES Cursos(CursoID),
    FOREIGN KEY (ParaleloID) REFERENCES Paralelos(ParaleloID)
);

CREATE TABLE ProfesoresAsignaturasParalelos (
    ProfesoresAsignaturasParaleloID INT PRIMARY KEY,
    ProfesorID INT,
    AnioLectivoID INT,
    AsignaturaID INT,
    CursoID INT,
    ParaleloID INT,
    FOREIGN KEY (ProfesorID) REFERENCES Profesores(ProfesorID),
    FOREIGN KEY (AnioLectivoID) REFERENCES AniosLectivos(AnioLectivoID),
    FOREIGN KEY (AsignaturaID) REFERENCES Asignaturas(AsignaturaID),
    FOREIGN KEY (CursoID) REFERENCES Cursos(CursoID),
    FOREIGN KEY (ParaleloID) REFERENCES Paralelos(ParaleloID)
);

CREATE TABLE Parciales (
  ParcialID INT PRIMARY KEY,
  ParcialInicio DATE NOT NULL,
  ParcialFin DATE NOT NULL
);

CREATE TABLE Calificaciones (
    CalificacionID INT PRIMARY KEY,
    EstudianteCursoParaleloID INT,
    ProfesoresAsignaturasParaleloID INT,
    ParcialID INT,
    Nota DECIMAL(5, 2),
    FOREIGN KEY (EstudianteCursoParaleloID) REFERENCES EstudiantesCursosParalelos(EstudianteCursoParaleloID),
    FOREIGN KEY (ProfesoresAsignaturasParaleloID) REFERENCES ProfesoresAsignaturasParalelos(ProfesoresAsignaturasParaleloID),
    FOREIGN KEY (ParcialID) REFERENCES Parciales(ParcialID)
);



-- Estructura de tabla para la tabla CURSO-ESTUDIANTES
CREATE TABLE MATRICULA (
  MTR_ID CHAR(36) NOT NULL PRIMARY KEY,
  CRS_ID CHAR(36) NOT NULL,
  EST_ID CHAR(36) NOT NULL,
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
  PASE enum ('Aprobado', 'Reprobado','Suspenso','En proceso') NOT NULL,
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
  FOREIGN KEY (CRS_ID) REFERENCES CURSO (CRS_ID),
  FOREIGN KEY (EST_ID) REFERENCES ESTUDIANTE (EST_ID)
);

-- Estructura de tabla para la tabla PARALELO-ESTUDIANTES
CREATE TABLE PARALELO_ESTUDIANTE (
  PRLL_EST_ID CHAR(36) NOT NULL PRIMARY KEY,
  PRLL_ID CHAR(36) NOT NULL,
  MTR_ID CHAR(36) NOT NULL,
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (MTR_ID) REFERENCES MATRICULA (MTR_ID),
  FOREIGN KEY (PRLL_ID) REFERENCES PARALELO (PRLL_ID),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID)
);

-- Estructura de tabla para la tabla PROFESOR_ASIGNATURA_PARALELO
CREATE TABLE PROFESOR_ASIGNATURA_PARALELO (
  PRF_ASG_PRLL_ID CHAR(36) NOT NULL PRIMARY KEY,
  ASG_ID CHAR(36) NOT NULL,
  PRF_ID CHAR(36) NOT NULL,
  PRLL_ID CHAR(36) NOT NULL,
  ESTADO TINYINT (1) NOT NULL CHECK (ESTADO IN (0, 1)),
  CREADOR_ID CHAR(36) NOT NULL,
  FECHA_CREACION DATETIME NOT NULL DEFAULT current_timestamp(),
  FOREIGN KEY (CREADOR_ID) REFERENCES USUARIO (USR_ID),
  FOREIGN KEY (PRLL_ID) REFERENCES PARALELO (PRLL_ID),
  FOREIGN KEY (ASG_ID) REFERENCES ASIGNATURA (ASG_ID),
  FOREIGN KEY (PRF_ID) REFERENCES USUARIO (USR_ID)
);