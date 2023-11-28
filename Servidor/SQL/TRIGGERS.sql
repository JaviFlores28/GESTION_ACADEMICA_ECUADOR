-- Desencadenador para la tabla DETALLE-PROFESOR
DELIMITER $$
CREATE OR REPLACE TRIGGER check_profesor_role BEFORE INSERT ON detalle_usuario_profesor FOR EACH ROW
BEGIN
    DECLARE v_role BOOLEAN ;
    -- SELECT ROL
    SELECT
        IFNULL(ROL_PRF, FALSE)
    INTO v_role
    FROM
    USUARIO
    WHERE USR_ID = NEW.USR_ID ; 
    --  VALIDAR
    IF v_role <> TRUE THEN 
      SIGNAL SQLSTATE '45000' 
      SET MESSAGE_TEXT = 'El usuario no tiene el rol de profesor o el rol es nulo' ; 
    END IF ;
END
$$ 
DELIMITER ;

-- Desencadenador para la tabla REPRESENTANTE
DELIMITER //
CREATE OR REPLACE TRIGGER check_representante_role BEFORE INSERT ON ESTUDIANTE FOR EACH ROW
BEGIN
    DECLARE v_role BOOLEAN ;
    -- SELECT ROL
    SELECT
        IFNULL(ROL_REPR, FALSE)
    INTO v_role
    FROM USUARIO
    WHERE USR_ID = NEW.REPR_ID ; 
    --  VALIDAR
    IF v_role <> TRUE THEN 
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'El usuario no tiene el rol de representante o el rol es nulo' ;
    END IF ;
END ;
//
DELIMITER ;

-- Creacion de periodos y subperiodos
DELIMITER $$
CREATE OR REPLACE TRIGGER `generar_periodo_subperiodo` AFTER INSERT ON `anio_lectivo` FOR EACH ROW BEGIN
    DECLARE i INT;
    DECLARE j INT;
    DECLARE k INT;
    DECLARE anioId VARCHAR(36);
    DECLARE periodoId VARCHAR(36);
    DECLARE parcialId VARCHAR(36);
    DECLARE periodo VARCHAR(36);
    SET anioId = NEW.AL_ID;
    SET i = 1;
    
    WHILE i <= NEW.NUM_PRD DO
        SELECT UUID() INTO periodoId;
        -- Insertar en la tabla periodo tipo normal
        INSERT INTO `periodo` (`PRD_ID`, `PRD_NOM`, `PRD_TIPO`, `AL_ID`, `ESTADO`, `CREADOR_ID`)
        VALUES (periodoId, CONCAT('Periodo-', i),'1', anioId,'1', NEW.CREADOR_ID);
        
        SET j = 1;
        
        WHILE j <= NEW.NUM_PRCL DO
            SELECT UUID() INTO parcialId;
            -- Insertar en la tabla subperiodo
            INSERT INTO parcial (`PRCL_ID`, `PRCL_NOM`, `PRCL_INI`, `PRCL_FIN`, `ESTADO`, `PRCL_TIPO`, `PRD_ID`, `CREADOR_ID`)
            VALUES (parcialId, CONCAT('Parcial-', j), NEW.AL_INICIO, NEW.AL_FIN, '1', '1', periodoId, NEW.CREADOR_ID);
            SET j = j + 1;
        END WHILE;
        
        SET j = 1;
        
        WHILE j <= NEW.NUM_EXAM DO
            SELECT UUID() INTO parcialId;
            -- Insertar en la tabla subperiodo
            INSERT INTO parcial (`PRCL_ID`, `PRCL_NOM`, `PRCL_INI`, `PRCL_FIN`, `ESTADO`, `PRCL_TIPO`, `PRD_ID`, `CREADOR_ID`)
            VALUES (parcialId, CONCAT('Examen-', j), NEW.AL_INICIO, NEW.AL_FIN, '1', '2', periodoId, NEW.CREADOR_ID);
            SET j = j + 1;
        END WHILE;
        
        SET i = i + 1;
    END WHILE;
    
    -- Insertar en la tabla periodo tipo extra
    SELECT UUID() INTO periodoId;
    INSERT INTO `periodo` (`PRD_ID`, `PRD_NOM`, `PRD_TIPO`, `AL_ID`, `ESTADO`, `CREADOR_ID`)
    VALUES (periodoId,'Suspenso','1',anioId,'1', NEW.CREADOR_ID);
    
    SET k = 1;
    WHILE k <= NEW.NUM_SUSP DO
        SELECT UUID() INTO parcialId;
        -- Insertar en la tabla subperiodo
        INSERT INTO parcial (`PRCL_ID`, `PRCL_NOM`, `PRCL_INI`, `PRCL_FIN`, `ESTADO`, `PRCL_TIPO`, `PRD_ID`, `CREADOR_ID`)
        VALUES (parcialId, CONCAT('Suspenso-', k), NEW.AL_INICIO, NEW.AL_FIN, '1', '2', periodoId, NEW.CREADOR_ID);
        SET k = k + 1;
    END WHILE;
END
$$
DELIMITER ;

-- Modificar la estructura de la tabla ESTUDIANTE_CURSO
DELIMITER //

CREATE OR REPLACE TRIGGER trg_validar_estudiante_curso
BEFORE INSERT OR UPDATE ON ESTUDIANTE_CURSO
FOR EACH ROW
BEGIN
  DECLARE estudiante_count INT;
  DECLARE curso_orden INT;
  DECLARE curso_orden_old INT;

  -- Verificar si el estudiante ya existe en ESTUDIANTE_CURSO
  SELECT COUNT(*) INTO estudiante_count
  FROM ESTUDIANTE_CURSO
  WHERE EST_ID = NEW.EST_ID;

  IF estudiante_count > 0 THEN
    -- Obtener el orden del curso a ingresar
    SELECT CRS_ORDEN INTO curso_orden
    FROM CURSO
    WHERE CRS_ID = NEW.CRS_ID;

    -- Obtener el orden del curso del ultimo curso ingresado
    SELECT MAX(CRS_ORDEN) INTO curso_orden_old
    FROM ESTUDIANTE_CURSO AS EC
    JOIN CURSO AS C ON EC.CRS_ID = C.CRS_ID
    WHERE EC.EST_ID = NEW.EST_ID;

    -- Verificar si el curso a ingresar sigue el orden de curso
    IF curso_orden <= curso_orden_old OR curso_orden != (curso_orden_old+1) THEN
      SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'El curso a ingresar no sigue el orden de curso.';
    END IF;
  END IF;
END //

DELIMITER ;
