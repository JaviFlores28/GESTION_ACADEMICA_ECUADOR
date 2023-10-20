
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


-- ----
--
DELIMITER $$
CREATE TRIGGER `generar_periodo_subperiodo` AFTER INSERT ON `anio_lectivo` FOR EACH ROW BEGIN
    DECLARE i INT;
    DECLARE j INT;
    DECLARE k INT;
    DECLARE anio INT;
    DECLARE periodo INT;
    SET anio = NEW.AL_ID;
    SET i = 1;
    
    WHILE i <= NEW.AL_PRD DO
        -- Insertar en la tabla periodo tipo normal
        INSERT INTO `periodo` (
            `AL_ID`,
            `PRD_NOM`,
            `PRD_TIPO`,
            `PRD_ESTADO`,
            `USR_CREADOR_ID`
        )
        VALUES (
            anio,
            CONCAT('Periodo', i),
            'N',
            'A',
            NEW.USR_CREADOR_ID
        );
        
        SET periodo = LAST_INSERT_ID();
        SET j = 1;
        
        WHILE j <= NEW.AL_SUB_PRD DO
            -- Insertar en la tabla subperiodo
            INSERT INTO subperiodo (
                PRD_ID,
                SPRD_NOM,
                SPRD_INI,
                SPRD_FIN,
                SPRD_TIPO,
                SPRD_ESTADO,
                USR_CREADOR_ID
            )
            VALUES (
                periodo,
                CONCAT('Parcial', j),
                NEW.AL_INI,
                NEW.AL_FIN,
                'N',
                'I',
                NEW.USR_CREADOR_ID
            );
            SET j = j + 1;
        END WHILE;
        
        SET j = 1;
        
        WHILE j <= NEW.AL_EXM DO
            -- Insertar en la tabla subperiodo
            INSERT INTO subperiodo (
                PRD_ID,
                SPRD_NOM,
                SPRD_INI,
                SPRD_FIN,
                SPRD_TIPO,
                SPRD_ESTADO,
                USR_CREADOR_ID
            )
            VALUES (
                periodo,
                CONCAT('Exámen', j),
                NEW.AL_INI,
                NEW.AL_FIN,
                'E',
                'I',
                NEW.USR_CREADOR_ID
            );
            SET j = j + 1;
        END WHILE;
        
        SET i = i + 1;
    END WHILE;
    
    -- Insertar en la tabla periodo tipo extra
    INSERT INTO `periodo` (
        `AL_ID`,
        `PRD_NOM`,
        `PRD_TIPO`,
        `PRD_ESTADO`,
        `USR_CREADOR_ID`
    )
    VALUES (
        anio,
        CONCAT('Extracurricular', i),
        'E',
        'A',
        NEW.USR_CREADOR_ID
    );
    
    SET periodo = LAST_INSERT_ID();
    SET k = 1;
    
    WHILE k <= NEW.AL_EXT DO
        -- Insertar en la tabla subperiodo
        INSERT INTO subperiodo (
            PRD_ID,
            SPRD_NOM,
            SPRD_INI,
            SPRD_FIN,
            SPRD_TIPO,
            SPRD_ESTADO,
            USR_CREADOR_ID
        )
        VALUES (
            periodo,
            CONCAT('Extra', K),
            NEW.AL_INI,
            NEW.AL_FIN,
            'E',
            'I',
            NEW.USR_CREADOR_ID
        );
        SET k = k + 1;
    END WHILE;
END
$$
DELIMITER ;

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