
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


CREATE VIEW VISTA_ESTUDIANTE AS SELECT
    E.EST_ID,
    E.EST_DNI,
    CONCAT(E.EST_NOM, ' ', E.EST_NOM2, ' ', E.EST_APE, ' ', E.EST_APE2) AS EST_NOM,
    CONCAT(U.USR_NOM, ' ', U.USR_NOM2, ' ', U.USR_APE, ' ', U.USR_APE2) AS REPR_ID,
    E.ESTADO
FROM 
    ESTUDIANTE AS E
JOIN 
    USUARIO AS U ON E.REPR_ID = U.USR_ID;



CREATE VIEW VISTA_USUARIO AS SELECT
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


User
PODRIAS USAR JOINS CON ESTA CONSULTA 
SELECT a.* FROM vista_estudiante AS a 
WHERE 
a.ESTADO = 1
AND
NOT EXISTS 
( 
  SELECT 1 FROM estudiante_curso AS b 
  WHERE b.EST_ID = a.EST_ID AND 
  (b.ESTADO = 1 OR b.CRS_ID = (SELECT CRS_ID FROM curso ORDER BY CRS_ORDEN DESC LIMIT 1)) 
) 