-- Desencadenador para la tabla PROFESOR
DELIMITER $$
CREATE TRIGGER check_profesor_role BEFORE INSERT ON PROFESOR FOR EACH ROW
BEGIN
    DECLARE v_role BOOLEAN ;
    -- SELECT ROL
    SELECT
        IFNULL(ROL_PROFESOR, FALSE)
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
CREATE TRIGGER check_representante_role BEFORE INSERT ON ESTUDIANTE FOR EACH ROW
BEGIN
    DECLARE v_role BOOLEAN ;
    -- SELECT ROL
    SELECT
        IFNULL(ROL_REPRESENTANTE, FALSE)
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

--
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
