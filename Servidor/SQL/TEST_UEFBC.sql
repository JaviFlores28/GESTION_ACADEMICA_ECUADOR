
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