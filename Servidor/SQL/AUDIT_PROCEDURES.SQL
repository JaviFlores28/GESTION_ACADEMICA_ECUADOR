DELIMITER //

CREATE PROCEDURE INSERT_ANIO_LECTIVO(
    IN p_AL_ID char(36),
    IN p_AL_NOM varchar(30),
    IN p_AL_INICIO date,
    IN p_AL_FIN date,
    IN p_AL_POR_PRD int(11),
    IN p_AL_POR_EXAM int(11),
    IN p_CLFN_MIN_APR float,
    IN p_CLFN_MIN_PERD float,
    IN p_PRD_NOM varchar(30),
    IN p_NUM_PRD int(11),
    IN p_NUM_EXAM int(11),
    IN p_NUM_PRCL int(11),
    IN p_NUM_SUSP int(11),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla anio_lectivo
    INSERT INTO anio_lectivo (AL_ID, AL_NOM, AL_INICIO, AL_FIN, AL_POR_PRD, AL_POR_EXAM, CLFN_MIN_APR, CLFN_MIN_PERD, PRD_NOM, NUM_PRD, NUM_EXAM, NUM_PRCL, NUM_SUSP, ESTADO)
    VALUES (p_AL_ID, p_AL_NOM, p_AL_INICIO, p_AL_FIN, p_AL_POR_PRD, p_AL_POR_EXAM, p_CLFN_MIN_APR, p_CLFN_MIN_PERD, p_PRD_NOM, p_NUM_PRD, p_NUM_EXAM, p_NUM_PRCL, p_NUM_SUSP, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO anio_lectivo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, AL_ID, AL_NOM, AL_INICIO, AL_FIN, AL_POR_PRD, AL_POR_EXAM, CLFN_MIN_APR, CLFN_MIN_PERD, PRD_NOM, NUM_PRD, NUM_EXAM, NUM_PRCL, NUM_SUSP, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_AL_ID, p_AL_NOM, p_AL_INICIO, p_AL_FIN, p_AL_POR_PRD, p_AL_POR_EXAM, p_CLFN_MIN_APR, p_CLFN_MIN_PERD, p_PRD_NOM, p_NUM_PRD, p_NUM_EXAM, p_NUM_PRCL, p_NUM_SUSP, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_ANIO_LECTIVO(
    IN p_AL_ID char(36),
    IN p_AL_NOM varchar(30),
    IN p_AL_INICIO date,
    IN p_AL_FIN date,
    IN p_AL_POR_PRD int(11),
    IN p_AL_POR_EXAM int(11),
    IN p_CLFN_MIN_APR float,
    IN p_CLFN_MIN_PERD float,
    IN p_PRD_NOM varchar(30),
    IN p_NUM_PRD int(11),
    IN p_NUM_EXAM int(11),
    IN p_NUM_PRCL int(11),
    IN p_NUM_SUSP int(11),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla anio_lectivo
    UPDATE anio_lectivo
    SET AL_ID = p_AL_ID, AL_NOM = p_AL_NOM, AL_INICIO = p_AL_INICIO, AL_FIN = p_AL_FIN, AL_POR_PRD = p_AL_POR_PRD, AL_POR_EXAM = p_AL_POR_EXAM, CLFN_MIN_APR = p_CLFN_MIN_APR, CLFN_MIN_PERD = p_CLFN_MIN_PERD, PRD_NOM = p_PRD_NOM, NUM_PRD = p_NUM_PRD, NUM_EXAM = p_NUM_EXAM, NUM_PRCL = p_NUM_PRCL, NUM_SUSP = p_NUM_SUSP, ESTADO = p_ESTADO
    WHERE AL_ID = p_AL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO anio_lectivo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, AL_ID, AL_NOM, AL_INICIO, AL_FIN, AL_POR_PRD, AL_POR_EXAM, CLFN_MIN_APR, CLFN_MIN_PERD, PRD_NOM, NUM_PRD, NUM_EXAM, NUM_PRCL, NUM_SUSP, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_AL_ID, p_AL_NOM, p_AL_INICIO, p_AL_FIN, p_AL_POR_PRD, p_AL_POR_EXAM, p_CLFN_MIN_APR, p_CLFN_MIN_PERD, p_PRD_NOM, p_NUM_PRD, p_NUM_EXAM, p_NUM_PRCL, p_NUM_SUSP, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_ANIO_LECTIVO(
    IN p_AL_ID char(36),
    IN p_AL_NOM varchar(30),
    IN p_AL_INICIO date,
    IN p_AL_FIN date,
    IN p_AL_POR_PRD int(11),
    IN p_AL_POR_EXAM int(11),
    IN p_CLFN_MIN_APR float,
    IN p_CLFN_MIN_PERD float,
    IN p_PRD_NOM varchar(30),
    IN p_NUM_PRD int(11),
    IN p_NUM_EXAM int(11),
    IN p_NUM_PRCL int(11),
    IN p_NUM_SUSP int(11),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del anio_lectivo antes de eliminar
    SELECT AL_ID, AL_NOM, AL_INICIO, AL_FIN, AL_POR_PRD, AL_POR_EXAM, CLFN_MIN_APR, CLFN_MIN_PERD, PRD_NOM, NUM_PRD, NUM_EXAM, NUM_PRCL, NUM_SUSP, ESTADO
    INTO @AL_ID, @AL_NOM, @AL_INICIO, @AL_FIN, @AL_POR_PRD, @AL_POR_EXAM, @CLFN_MIN_APR, @CLFN_MIN_PERD, @PRD_NOM, @NUM_PRD, @NUM_EXAM, @NUM_PRCL, @NUM_SUSP, @ESTADO
    FROM anio_lectivo
    WHERE AL_ID = p_AL_ID;

    -- Realizar la eliminación en la tabla anio_lectivo
    DELETE FROM anio_lectivo WHERE AL_ID = p_AL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO anio_lectivo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, AL_ID, AL_NOM, AL_INICIO, AL_FIN, AL_POR_PRD, AL_POR_EXAM, CLFN_MIN_APR, CLFN_MIN_PERD, PRD_NOM, NUM_PRD, NUM_EXAM, NUM_PRCL, NUM_SUSP, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_AL_ID, p_AL_NOM, p_AL_INICIO, p_AL_FIN, p_AL_POR_PRD, p_AL_POR_EXAM, p_CLFN_MIN_APR, p_CLFN_MIN_PERD, p_PRD_NOM, p_NUM_PRD, p_NUM_EXAM, p_NUM_PRCL, p_NUM_SUSP, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_AREA(
    IN p_AREA_ID char(36),
    IN p_AREA_NOM varchar(300),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla area
    INSERT INTO area (AREA_ID, AREA_NOM, ESTADO)
    VALUES (p_AREA_ID, p_AREA_NOM, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO area_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, AREA_ID, AREA_NOM, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_AREA_ID, p_AREA_NOM, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_AREA(
    IN p_AREA_ID char(36),
    IN p_AREA_NOM varchar(300),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla area
    UPDATE area
    SET AREA_ID = p_AREA_ID, AREA_NOM = p_AREA_NOM, ESTADO = p_ESTADO
    WHERE AREA_ID = p_AREA_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO area_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, AREA_ID, AREA_NOM, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_AREA_ID, p_AREA_NOM, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_AREA(
    IN p_AREA_ID char(36),
    IN p_AREA_NOM varchar(300),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del area antes de eliminar
    SELECT AREA_ID, AREA_NOM, ESTADO
    INTO @AREA_ID, @AREA_NOM, @ESTADO
    FROM area
    WHERE AREA_ID = p_AREA_ID;

    -- Realizar la eliminación en la tabla area
    DELETE FROM area WHERE AREA_ID = p_AREA_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO area_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, AREA_ID, AREA_NOM, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_AREA_ID, p_AREA_NOM, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_ASIGNATURA(
    IN p_ASG_ID char(36),
    IN p_ASG_NOM varchar(50),
    IN p_ASG_TIPO enum('cualitativa','cuantitativa'),
    IN p_AREA_ID char(36),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla asignatura
    INSERT INTO asignatura (ASG_ID, ASG_NOM, ASG_TIPO, AREA_ID, ESTADO)
    VALUES (p_ASG_ID, p_ASG_NOM, p_ASG_TIPO, p_AREA_ID, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO asignatura_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, ASG_ID, ASG_NOM, ASG_TIPO, AREA_ID, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_ASG_ID, p_ASG_NOM, p_ASG_TIPO, p_AREA_ID, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_ASIGNATURA(
    IN p_ASG_ID char(36),
    IN p_ASG_NOM varchar(50),
    IN p_ASG_TIPO enum('cualitativa','cuantitativa'),
    IN p_AREA_ID char(36),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla asignatura
    UPDATE asignatura
    SET ASG_ID = p_ASG_ID, ASG_NOM = p_ASG_NOM, ASG_TIPO = p_ASG_TIPO, AREA_ID = p_AREA_ID, ESTADO = p_ESTADO
    WHERE ASG_ID = p_ASG_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO asignatura_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, ASG_ID, ASG_NOM, ASG_TIPO, AREA_ID, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_ASG_ID, p_ASG_NOM, p_ASG_TIPO, p_AREA_ID, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_ASIGNATURA(
    IN p_ASG_ID char(36),
    IN p_ASG_NOM varchar(50),
    IN p_ASG_TIPO enum('cualitativa','cuantitativa'),
    IN p_AREA_ID char(36),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del asignatura antes de eliminar
    SELECT ASG_ID, ASG_NOM, ASG_TIPO, AREA_ID, ESTADO
    INTO @ASG_ID, @ASG_NOM, @ASG_TIPO, @AREA_ID, @ESTADO
    FROM asignatura
    WHERE ASG_ID = p_ASG_ID;

    -- Realizar la eliminación en la tabla asignatura
    DELETE FROM asignatura WHERE ASG_ID = p_ASG_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO asignatura_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, ASG_ID, ASG_NOM, ASG_TIPO, AREA_ID, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_ASG_ID, p_ASG_NOM, p_ASG_TIPO, p_AREA_ID, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_CALIFICACIONES_CUALITATIVAS(
    IN p_CAL_ID char(36),
    IN p_PRF_ASG_PRLL_ID char(36),
    IN p_EST_CRS_PRLL_ID char(36),
    IN p_PRD_ID char(36),
    IN p_CALIFICACION char(1),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla calificaciones_cualitativas
    INSERT INTO calificaciones_cualitativas (CAL_ID, PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID, PRD_ID, CALIFICACION, ESTADO)
    VALUES (p_CAL_ID, p_PRF_ASG_PRLL_ID, p_EST_CRS_PRLL_ID, p_PRD_ID, p_CALIFICACION, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO calificaciones_cualitativas_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, CAL_ID, PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID, PRD_ID, CALIFICACION, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_CAL_ID, p_PRF_ASG_PRLL_ID, p_EST_CRS_PRLL_ID, p_PRD_ID, p_CALIFICACION, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_CALIFICACIONES_CUALITATIVAS(
    IN p_CAL_ID char(36),
    IN p_PRF_ASG_PRLL_ID char(36),
    IN p_EST_CRS_PRLL_ID char(36),
    IN p_PRD_ID char(36),
    IN p_CALIFICACION char(1),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla calificaciones_cualitativas
    UPDATE calificaciones_cualitativas
    SET CAL_ID = p_CAL_ID, PRF_ASG_PRLL_ID = p_PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID = p_EST_CRS_PRLL_ID, PRD_ID = p_PRD_ID, CALIFICACION = p_CALIFICACION, ESTADO = p_ESTADO
    WHERE CAL_ID = p_CAL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO calificaciones_cualitativas_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, CAL_ID, PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID, PRD_ID, CALIFICACION, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_CAL_ID, p_PRF_ASG_PRLL_ID, p_EST_CRS_PRLL_ID, p_PRD_ID, p_CALIFICACION, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_CALIFICACIONES_CUALITATIVAS(
    IN p_CAL_ID char(36),
    IN p_PRF_ASG_PRLL_ID char(36),
    IN p_EST_CRS_PRLL_ID char(36),
    IN p_PRD_ID char(36),
    IN p_CALIFICACION char(1),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del calificaciones_cualitativas antes de eliminar
    SELECT CAL_ID, PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID, PRD_ID, CALIFICACION, ESTADO
    INTO @CAL_ID, @PRF_ASG_PRLL_ID, @EST_CRS_PRLL_ID, @PRD_ID, @CALIFICACION, @ESTADO
    FROM calificaciones_cualitativas
    WHERE CAL_ID = p_CAL_ID;

    -- Realizar la eliminación en la tabla calificaciones_cualitativas
    DELETE FROM calificaciones_cualitativas WHERE CAL_ID = p_CAL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO calificaciones_cualitativas_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, CAL_ID, PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID, PRD_ID, CALIFICACION, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_CAL_ID, p_PRF_ASG_PRLL_ID, p_EST_CRS_PRLL_ID, p_PRD_ID, p_CALIFICACION, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_CALIFICACIONES_CUANTITATIVAS(
    IN p_CAL_ID char(36),
    IN p_PRF_ASG_PRLL_ID char(36),
    IN p_EST_CRS_PRLL_ID char(36),
    IN p_PRCL_ID char(36),
    IN p_CALIFICACION decimal(4,2),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla calificaciones_cuantitativas
    INSERT INTO calificaciones_cuantitativas (CAL_ID, PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID, PRCL_ID, CALIFICACION)
    VALUES (p_CAL_ID, p_PRF_ASG_PRLL_ID, p_EST_CRS_PRLL_ID, p_PRCL_ID, p_CALIFICACION);
    -- Insertar el registro en la tabla auditora
    INSERT INTO calificaciones_cuantitativas_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, CAL_ID, PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID, PRCL_ID, CALIFICACION, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_CAL_ID, p_PRF_ASG_PRLL_ID, p_EST_CRS_PRLL_ID, p_PRCL_ID, p_CALIFICACION, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_CALIFICACIONES_CUANTITATIVAS(
    IN p_CAL_ID char(36),
    IN p_PRF_ASG_PRLL_ID char(36),
    IN p_EST_CRS_PRLL_ID char(36),
    IN p_PRCL_ID char(36),
    IN p_CALIFICACION decimal(4,2),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla calificaciones_cuantitativas
    UPDATE calificaciones_cuantitativas
    SET CAL_ID = p_CAL_ID, PRF_ASG_PRLL_ID = p_PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID = p_EST_CRS_PRLL_ID, PRCL_ID = p_PRCL_ID, CALIFICACION = p_CALIFICACION
    WHERE CAL_ID = p_CAL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO calificaciones_cuantitativas_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, CAL_ID, PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID, PRCL_ID, CALIFICACION, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_CAL_ID, p_PRF_ASG_PRLL_ID, p_EST_CRS_PRLL_ID, p_PRCL_ID, p_CALIFICACION, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_CALIFICACIONES_CUANTITATIVAS(
    IN p_CAL_ID char(36),
    IN p_PRF_ASG_PRLL_ID char(36),
    IN p_EST_CRS_PRLL_ID char(36),
    IN p_PRCL_ID char(36),
    IN p_CALIFICACION decimal(4,2),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del calificaciones_cuantitativas antes de eliminar
    SELECT CAL_ID, PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID, PRCL_ID, CALIFICACION
    INTO @CAL_ID, @PRF_ASG_PRLL_ID, @EST_CRS_PRLL_ID, @PRCL_ID, @CALIFICACION
    FROM calificaciones_cuantitativas
    WHERE CAL_ID = p_CAL_ID;

    -- Realizar la eliminación en la tabla calificaciones_cuantitativas
    DELETE FROM calificaciones_cuantitativas WHERE CAL_ID = p_CAL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO calificaciones_cuantitativas_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, CAL_ID, PRF_ASG_PRLL_ID, EST_CRS_PRLL_ID, PRCL_ID, CALIFICACION, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_CAL_ID, p_PRF_ASG_PRLL_ID, p_EST_CRS_PRLL_ID, p_PRCL_ID, p_CALIFICACION, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_CURSO(
    IN p_CRS_ID char(36),
    IN p_CRS_NOM varchar(10),
    IN p_CRS_TIPO varchar(10),
    IN p_CRS_ORDEN int(11),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla curso
    INSERT INTO curso (CRS_ID, CRS_NOM, CRS_TIPO, CRS_ORDEN, ESTADO)
    VALUES (p_CRS_ID, p_CRS_NOM, p_CRS_TIPO, p_CRS_ORDEN, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO curso_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, CRS_ID, CRS_NOM, CRS_TIPO, CRS_ORDEN, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_CRS_ID, p_CRS_NOM, p_CRS_TIPO, p_CRS_ORDEN, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_CURSO(
    IN p_CRS_ID char(36),
    IN p_CRS_NOM varchar(10),
    IN p_CRS_TIPO varchar(10),
    IN p_CRS_ORDEN int(11),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla curso
    UPDATE curso
    SET CRS_ID = p_CRS_ID, CRS_NOM = p_CRS_NOM, CRS_TIPO = p_CRS_TIPO, CRS_ORDEN = p_CRS_ORDEN, ESTADO = p_ESTADO
    WHERE CRS_ID = p_CRS_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO curso_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, CRS_ID, CRS_NOM, CRS_TIPO, CRS_ORDEN, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_CRS_ID, p_CRS_NOM, p_CRS_TIPO, p_CRS_ORDEN, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_CURSO(
    IN p_CRS_ID char(36),
    IN p_CRS_NOM varchar(10),
    IN p_CRS_TIPO varchar(10),
    IN p_CRS_ORDEN int(11),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del curso antes de eliminar
    SELECT CRS_ID, CRS_NOM, CRS_TIPO, CRS_ORDEN, ESTADO
    INTO @CRS_ID, @CRS_NOM, @CRS_TIPO, @CRS_ORDEN, @ESTADO
    FROM curso
    WHERE CRS_ID = p_CRS_ID;

    -- Realizar la eliminación en la tabla curso
    DELETE FROM curso WHERE CRS_ID = p_CRS_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO curso_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, CRS_ID, CRS_NOM, CRS_TIPO, CRS_ORDEN, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_CRS_ID, p_CRS_NOM, p_CRS_TIPO, p_CRS_ORDEN, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_ESCALAS_REFERENCIALES_CALIFICACIONES(
    IN p_ESCL_ID char(36),
    IN p_ESCL_ABRV char(2),
    IN p_ESCL_DESCR varchar(255),
    IN p_ESCL_INI decimal(5,2),
    IN p_ESCL_FIN decimal(5,2),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla escalas_referenciales_calificaciones
    INSERT INTO escalas_referenciales_calificaciones (ESCL_ID, ESCL_ABRV, ESCL_DESCR, ESCL_INI, ESCL_FIN, ESTADO)
    VALUES (p_ESCL_ID, p_ESCL_ABRV, p_ESCL_DESCR, p_ESCL_INI, p_ESCL_FIN, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO escalas_referenciales_calificaciones_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, ESCL_ID, ESCL_ABRV, ESCL_DESCR, ESCL_INI, ESCL_FIN, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_ESCL_ID, p_ESCL_ABRV, p_ESCL_DESCR, p_ESCL_INI, p_ESCL_FIN, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_ESCALAS_REFERENCIALES_CALIFICACIONES(
    IN p_ESCL_ID char(36),
    IN p_ESCL_ABRV char(2),
    IN p_ESCL_DESCR varchar(255),
    IN p_ESCL_INI decimal(5,2),
    IN p_ESCL_FIN decimal(5,2),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla escalas_referenciales_calificaciones
    UPDATE escalas_referenciales_calificaciones
    SET ESCL_ID = p_ESCL_ID, ESCL_ABRV = p_ESCL_ABRV, ESCL_DESCR = p_ESCL_DESCR, ESCL_INI = p_ESCL_INI, ESCL_FIN = p_ESCL_FIN, ESTADO = p_ESTADO
    WHERE ESCL_ID = p_ESCL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO escalas_referenciales_calificaciones_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, ESCL_ID, ESCL_ABRV, ESCL_DESCR, ESCL_INI, ESCL_FIN, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_ESCL_ID, p_ESCL_ABRV, p_ESCL_DESCR, p_ESCL_INI, p_ESCL_FIN, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_ESCALAS_REFERENCIALES_CALIFICACIONES(
    IN p_ESCL_ID char(36),
    IN p_ESCL_ABRV char(2),
    IN p_ESCL_DESCR varchar(255),
    IN p_ESCL_INI decimal(5,2),
    IN p_ESCL_FIN decimal(5,2),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del escalas_referenciales_calificaciones antes de eliminar
    SELECT ESCL_ID, ESCL_ABRV, ESCL_DESCR, ESCL_INI, ESCL_FIN, ESTADO
    INTO @ESCL_ID, @ESCL_ABRV, @ESCL_DESCR, @ESCL_INI, @ESCL_FIN, @ESTADO
    FROM escalas_referenciales_calificaciones
    WHERE ESCL_ID = p_ESCL_ID;

    -- Realizar la eliminación en la tabla escalas_referenciales_calificaciones
    DELETE FROM escalas_referenciales_calificaciones WHERE ESCL_ID = p_ESCL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO escalas_referenciales_calificaciones_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, ESCL_ID, ESCL_ABRV, ESCL_DESCR, ESCL_INI, ESCL_FIN, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_ESCL_ID, p_ESCL_ABRV, p_ESCL_DESCR, p_ESCL_INI, p_ESCL_FIN, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_ESTUDIANTE(
    IN p_EST_ID char(36),
    IN p_EST_DNI varchar(10),
    IN p_EST_NOM varchar(100),
    IN p_EST_NOM2 varchar(100),
    IN p_EST_APE varchar(100),
    IN p_EST_APE2 varchar(100),
    IN p_EST_FECH_NAC date,
    IN p_EST_GEN char(1),
    IN p_EST_PRV varchar(50),
    IN p_EST_CAN varchar(50),
    IN p_EST_PARR varchar(50),
    IN p_EST_DIR varchar(150),
    IN p_EST_NAC varchar(50),
    IN p_EST_ETN varchar(50),
    IN p_EST_NAC_ETN varchar(50),
    IN p_EST_COM_ETN varchar(50),
    IN p_EST_COD_ELE varchar(15),
    IN p_EST_NEC_ASO_DIS tinyint(1),
    IN p_EST_NEC_NO_ASO_DIS tinyint(1),
    IN p_EST_ENF_CAT tinyint(1),
    IN p_EST_NUM_CONA varchar(10),
    IN p_EST_INTE tinyint(1),
    IN p_EST_TV tinyint(1),
    IN p_EST_RAD tinyint(1),
    IN p_EST_PC tinyint(1),
    IN p_EST_CEL tinyint(1),
    IN p_REPR_ID char(36),
    IN p_REL_EST_REP varchar(50),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla estudiante
    INSERT INTO estudiante (EST_ID, EST_DNI, EST_NOM, EST_NOM2, EST_APE, EST_APE2, EST_FECH_NAC, EST_GEN, EST_PRV, EST_CAN, EST_PARR, EST_DIR, EST_NAC, EST_ETN, EST_NAC_ETN, EST_COM_ETN, EST_COD_ELE, EST_NEC_ASO_DIS, EST_NEC_NO_ASO_DIS, EST_ENF_CAT, EST_NUM_CONA, EST_INTE, EST_TV, EST_RAD, EST_PC, EST_CEL, REPR_ID, REL_EST_REP, ESTADO)
    VALUES (p_EST_ID, p_EST_DNI, p_EST_NOM, p_EST_NOM2, p_EST_APE, p_EST_APE2, p_EST_FECH_NAC, p_EST_GEN, p_EST_PRV, p_EST_CAN, p_EST_PARR, p_EST_DIR, p_EST_NAC, p_EST_ETN, p_EST_NAC_ETN, p_EST_COM_ETN, p_EST_COD_ELE, p_EST_NEC_ASO_DIS, p_EST_NEC_NO_ASO_DIS, p_EST_ENF_CAT, p_EST_NUM_CONA, p_EST_INTE, p_EST_TV, p_EST_RAD, p_EST_PC, p_EST_CEL, p_REPR_ID, p_REL_EST_REP, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO estudiante_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, EST_ID, EST_DNI, EST_NOM, EST_NOM2, EST_APE, EST_APE2, EST_FECH_NAC, EST_GEN, EST_PRV, EST_CAN, EST_PARR, EST_DIR, EST_NAC, EST_ETN, EST_NAC_ETN, EST_COM_ETN, EST_COD_ELE, EST_NEC_ASO_DIS, EST_NEC_NO_ASO_DIS, EST_ENF_CAT, EST_NUM_CONA, EST_INTE, EST_TV, EST_RAD, EST_PC, EST_CEL, REPR_ID, REL_EST_REP, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_EST_ID, p_EST_DNI, p_EST_NOM, p_EST_NOM2, p_EST_APE, p_EST_APE2, p_EST_FECH_NAC, p_EST_GEN, p_EST_PRV, p_EST_CAN, p_EST_PARR, p_EST_DIR, p_EST_NAC, p_EST_ETN, p_EST_NAC_ETN, p_EST_COM_ETN, p_EST_COD_ELE, p_EST_NEC_ASO_DIS, p_EST_NEC_NO_ASO_DIS, p_EST_ENF_CAT, p_EST_NUM_CONA, p_EST_INTE, p_EST_TV, p_EST_RAD, p_EST_PC, p_EST_CEL, p_REPR_ID, p_REL_EST_REP, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_ESTUDIANTE(
    IN p_EST_ID char(36),
    IN p_EST_DNI varchar(10),
    IN p_EST_NOM varchar(100),
    IN p_EST_NOM2 varchar(100),
    IN p_EST_APE varchar(100),
    IN p_EST_APE2 varchar(100),
    IN p_EST_FECH_NAC date,
    IN p_EST_GEN char(1),
    IN p_EST_PRV varchar(50),
    IN p_EST_CAN varchar(50),
    IN p_EST_PARR varchar(50),
    IN p_EST_DIR varchar(150),
    IN p_EST_NAC varchar(50),
    IN p_EST_ETN varchar(50),
    IN p_EST_NAC_ETN varchar(50),
    IN p_EST_COM_ETN varchar(50),
    IN p_EST_COD_ELE varchar(15),
    IN p_EST_NEC_ASO_DIS tinyint(1),
    IN p_EST_NEC_NO_ASO_DIS tinyint(1),
    IN p_EST_ENF_CAT tinyint(1),
    IN p_EST_NUM_CONA varchar(10),
    IN p_EST_INTE tinyint(1),
    IN p_EST_TV tinyint(1),
    IN p_EST_RAD tinyint(1),
    IN p_EST_PC tinyint(1),
    IN p_EST_CEL tinyint(1),
    IN p_REPR_ID char(36),
    IN p_REL_EST_REP varchar(50),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla estudiante
    UPDATE estudiante
    SET EST_ID = p_EST_ID, EST_DNI = p_EST_DNI, EST_NOM = p_EST_NOM, EST_NOM2 = p_EST_NOM2, EST_APE = p_EST_APE, EST_APE2 = p_EST_APE2, EST_FECH_NAC = p_EST_FECH_NAC, EST_GEN = p_EST_GEN, EST_PRV = p_EST_PRV, EST_CAN = p_EST_CAN, EST_PARR = p_EST_PARR, EST_DIR = p_EST_DIR, EST_NAC = p_EST_NAC, EST_ETN = p_EST_ETN, EST_NAC_ETN = p_EST_NAC_ETN, EST_COM_ETN = p_EST_COM_ETN, EST_COD_ELE = p_EST_COD_ELE, EST_NEC_ASO_DIS = p_EST_NEC_ASO_DIS, EST_NEC_NO_ASO_DIS = p_EST_NEC_NO_ASO_DIS, EST_ENF_CAT = p_EST_ENF_CAT, EST_NUM_CONA = p_EST_NUM_CONA, EST_INTE = p_EST_INTE, EST_TV = p_EST_TV, EST_RAD = p_EST_RAD, EST_PC = p_EST_PC, EST_CEL = p_EST_CEL, REPR_ID = p_REPR_ID, REL_EST_REP = p_REL_EST_REP, ESTADO = p_ESTADO
    WHERE EST_ID = p_EST_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO estudiante_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, EST_ID, EST_DNI, EST_NOM, EST_NOM2, EST_APE, EST_APE2, EST_FECH_NAC, EST_GEN, EST_PRV, EST_CAN, EST_PARR, EST_DIR, EST_NAC, EST_ETN, EST_NAC_ETN, EST_COM_ETN, EST_COD_ELE, EST_NEC_ASO_DIS, EST_NEC_NO_ASO_DIS, EST_ENF_CAT, EST_NUM_CONA, EST_INTE, EST_TV, EST_RAD, EST_PC, EST_CEL, REPR_ID, REL_EST_REP, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_EST_ID, p_EST_DNI, p_EST_NOM, p_EST_NOM2, p_EST_APE, p_EST_APE2, p_EST_FECH_NAC, p_EST_GEN, p_EST_PRV, p_EST_CAN, p_EST_PARR, p_EST_DIR, p_EST_NAC, p_EST_ETN, p_EST_NAC_ETN, p_EST_COM_ETN, p_EST_COD_ELE, p_EST_NEC_ASO_DIS, p_EST_NEC_NO_ASO_DIS, p_EST_ENF_CAT, p_EST_NUM_CONA, p_EST_INTE, p_EST_TV, p_EST_RAD, p_EST_PC, p_EST_CEL, p_REPR_ID, p_REL_EST_REP, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_ESTUDIANTE(
    IN p_EST_ID char(36),
    IN p_EST_DNI varchar(10),
    IN p_EST_NOM varchar(100),
    IN p_EST_NOM2 varchar(100),
    IN p_EST_APE varchar(100),
    IN p_EST_APE2 varchar(100),
    IN p_EST_FECH_NAC date,
    IN p_EST_GEN char(1),
    IN p_EST_PRV varchar(50),
    IN p_EST_CAN varchar(50),
    IN p_EST_PARR varchar(50),
    IN p_EST_DIR varchar(150),
    IN p_EST_NAC varchar(50),
    IN p_EST_ETN varchar(50),
    IN p_EST_NAC_ETN varchar(50),
    IN p_EST_COM_ETN varchar(50),
    IN p_EST_COD_ELE varchar(15),
    IN p_EST_NEC_ASO_DIS tinyint(1),
    IN p_EST_NEC_NO_ASO_DIS tinyint(1),
    IN p_EST_ENF_CAT tinyint(1),
    IN p_EST_NUM_CONA varchar(10),
    IN p_EST_INTE tinyint(1),
    IN p_EST_TV tinyint(1),
    IN p_EST_RAD tinyint(1),
    IN p_EST_PC tinyint(1),
    IN p_EST_CEL tinyint(1),
    IN p_REPR_ID char(36),
    IN p_REL_EST_REP varchar(50),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del estudiante antes de eliminar
    SELECT EST_ID, EST_DNI, EST_NOM, EST_NOM2, EST_APE, EST_APE2, EST_FECH_NAC, EST_GEN, EST_PRV, EST_CAN, EST_PARR, EST_DIR, EST_NAC, EST_ETN, EST_NAC_ETN, EST_COM_ETN, EST_COD_ELE, EST_NEC_ASO_DIS, EST_NEC_NO_ASO_DIS, EST_ENF_CAT, EST_NUM_CONA, EST_INTE, EST_TV, EST_RAD, EST_PC, EST_CEL, REPR_ID, REL_EST_REP, ESTADO
    INTO @EST_ID, @EST_DNI, @EST_NOM, @EST_NOM2, @EST_APE, @EST_APE2, @EST_FECH_NAC, @EST_GEN, @EST_PRV, @EST_CAN, @EST_PARR, @EST_DIR, @EST_NAC, @EST_ETN, @EST_NAC_ETN, @EST_COM_ETN, @EST_COD_ELE, @EST_NEC_ASO_DIS, @EST_NEC_NO_ASO_DIS, @EST_ENF_CAT, @EST_NUM_CONA, @EST_INTE, @EST_TV, @EST_RAD, @EST_PC, @EST_CEL, @REPR_ID, @REL_EST_REP, @ESTADO
    FROM estudiante
    WHERE EST_ID = p_EST_ID;

    -- Realizar la eliminación en la tabla estudiante
    DELETE FROM estudiante WHERE EST_ID = p_EST_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO estudiante_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, EST_ID, EST_DNI, EST_NOM, EST_NOM2, EST_APE, EST_APE2, EST_FECH_NAC, EST_GEN, EST_PRV, EST_CAN, EST_PARR, EST_DIR, EST_NAC, EST_ETN, EST_NAC_ETN, EST_COM_ETN, EST_COD_ELE, EST_NEC_ASO_DIS, EST_NEC_NO_ASO_DIS, EST_ENF_CAT, EST_NUM_CONA, EST_INTE, EST_TV, EST_RAD, EST_PC, EST_CEL, REPR_ID, REL_EST_REP, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_EST_ID, p_EST_DNI, p_EST_NOM, p_EST_NOM2, p_EST_APE, p_EST_APE2, p_EST_FECH_NAC, p_EST_GEN, p_EST_PRV, p_EST_CAN, p_EST_PARR, p_EST_DIR, p_EST_NAC, p_EST_ETN, p_EST_NAC_ETN, p_EST_COM_ETN, p_EST_COD_ELE, p_EST_NEC_ASO_DIS, p_EST_NEC_NO_ASO_DIS, p_EST_ENF_CAT, p_EST_NUM_CONA, p_EST_INTE, p_EST_TV, p_EST_RAD, p_EST_PC, p_EST_CEL, p_REPR_ID, p_REL_EST_REP, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_ESTUDIANTE_CURSO(
    IN p_EST_CRS_ID char(36),
    IN p_EST_ID char(36),
    IN p_CRS_ID char(36),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla estudiante_curso
    INSERT INTO estudiante_curso (EST_CRS_ID, EST_ID, CRS_ID, ESTADO)
    VALUES (p_EST_CRS_ID, p_EST_ID, p_CRS_ID, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO estudiante_curso_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, EST_CRS_ID, EST_ID, CRS_ID, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_EST_CRS_ID, p_EST_ID, p_CRS_ID, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_ESTUDIANTE_CURSO(
    IN p_EST_CRS_ID char(36),
    IN p_EST_ID char(36),
    IN p_CRS_ID char(36),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla estudiante_curso
    UPDATE estudiante_curso
    SET EST_CRS_ID = p_EST_CRS_ID, EST_ID = p_EST_ID, CRS_ID = p_CRS_ID, ESTADO = p_ESTADO
    WHERE EST_CRS_ID = p_EST_CRS_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO estudiante_curso_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, EST_CRS_ID, EST_ID, CRS_ID, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_EST_CRS_ID, p_EST_ID, p_CRS_ID, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_ESTUDIANTE_CURSO(
    IN p_EST_CRS_ID char(36),
    IN p_EST_ID char(36),
    IN p_CRS_ID char(36),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del estudiante_curso antes de eliminar
    SELECT EST_CRS_ID, EST_ID, CRS_ID, ESTADO
    INTO @EST_CRS_ID, @EST_ID, @CRS_ID, @ESTADO
    FROM estudiante_curso
    WHERE EST_CRS_ID = p_EST_CRS_ID;

    -- Realizar la eliminación en la tabla estudiante_curso
    DELETE FROM estudiante_curso WHERE EST_CRS_ID = p_EST_CRS_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO estudiante_curso_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, EST_CRS_ID, EST_ID, CRS_ID, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_EST_CRS_ID, p_EST_ID, p_CRS_ID, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_ESTUDIANTE_CURSO_PARALELO(
    IN p_EST_CRS_PRLL_ID char(36),
    IN p_EST_CRS_ID char(36),
    IN p_AL_ID char(36),
    IN p_PRLL_ID char(36),
    IN p_PASE enum('aprobado','reprobado','suspenso','en proceso','retirado'),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla estudiante_curso_paralelo
    INSERT INTO estudiante_curso_paralelo (EST_CRS_PRLL_ID, EST_CRS_ID, AL_ID, PRLL_ID, PASE, ESTADO)
    VALUES (p_EST_CRS_PRLL_ID, p_EST_CRS_ID, p_AL_ID, p_PRLL_ID, p_PASE, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO estudiante_curso_paralelo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, EST_CRS_PRLL_ID, EST_CRS_ID, AL_ID, PRLL_ID, PASE, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_EST_CRS_PRLL_ID, p_EST_CRS_ID, p_AL_ID, p_PRLL_ID, p_PASE, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_ESTUDIANTE_CURSO_PARALELO(
    IN p_EST_CRS_PRLL_ID char(36),
    IN p_EST_CRS_ID char(36),
    IN p_AL_ID char(36),
    IN p_PRLL_ID char(36),
    IN p_PASE enum('aprobado','reprobado','suspenso','en proceso','retirado'),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla estudiante_curso_paralelo
    UPDATE estudiante_curso_paralelo
    SET EST_CRS_PRLL_ID = p_EST_CRS_PRLL_ID, EST_CRS_ID = p_EST_CRS_ID, AL_ID = p_AL_ID, PRLL_ID = p_PRLL_ID, PASE = p_PASE, ESTADO = p_ESTADO
    WHERE EST_CRS_PRLL_ID = p_EST_CRS_PRLL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO estudiante_curso_paralelo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, EST_CRS_PRLL_ID, EST_CRS_ID, AL_ID, PRLL_ID, PASE, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_EST_CRS_PRLL_ID, p_EST_CRS_ID, p_AL_ID, p_PRLL_ID, p_PASE, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_ESTUDIANTE_CURSO_PARALELO(
    IN p_EST_CRS_PRLL_ID char(36),
    IN p_EST_CRS_ID char(36),
    IN p_AL_ID char(36),
    IN p_PRLL_ID char(36),
    IN p_PASE enum('aprobado','reprobado','suspenso','en proceso','retirado'),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del estudiante_curso_paralelo antes de eliminar
    SELECT EST_CRS_PRLL_ID, EST_CRS_ID, AL_ID, PRLL_ID, PASE, ESTADO
    INTO @EST_CRS_PRLL_ID, @EST_CRS_ID, @AL_ID, @PRLL_ID, @PASE, @ESTADO
    FROM estudiante_curso_paralelo
    WHERE EST_CRS_PRLL_ID = p_EST_CRS_PRLL_ID;

    -- Realizar la eliminación en la tabla estudiante_curso_paralelo
    DELETE FROM estudiante_curso_paralelo WHERE EST_CRS_PRLL_ID = p_EST_CRS_PRLL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO estudiante_curso_paralelo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, EST_CRS_PRLL_ID, EST_CRS_ID, AL_ID, PRLL_ID, PASE, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_EST_CRS_PRLL_ID, p_EST_CRS_ID, p_AL_ID, p_PRLL_ID, p_PASE, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_PARALELO(
    IN p_PRLL_ID char(36),
    IN p_PRLL_NOM varchar(100),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla paralelo
    INSERT INTO paralelo (PRLL_ID, PRLL_NOM, ESTADO)
    VALUES (p_PRLL_ID, p_PRLL_NOM, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO paralelo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRLL_ID, PRLL_NOM, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_PRLL_ID, p_PRLL_NOM, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_PARALELO(
    IN p_PRLL_ID char(36),
    IN p_PRLL_NOM varchar(100),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla paralelo
    UPDATE paralelo
    SET PRLL_ID = p_PRLL_ID, PRLL_NOM = p_PRLL_NOM, ESTADO = p_ESTADO
    WHERE PRLL_ID = p_PRLL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO paralelo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRLL_ID, PRLL_NOM, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_PRLL_ID, p_PRLL_NOM, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_PARALELO(
    IN p_PRLL_ID char(36),
    IN p_PRLL_NOM varchar(100),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del paralelo antes de eliminar
    SELECT PRLL_ID, PRLL_NOM, ESTADO
    INTO @PRLL_ID, @PRLL_NOM, @ESTADO
    FROM paralelo
    WHERE PRLL_ID = p_PRLL_ID;

    -- Realizar la eliminación en la tabla paralelo
    DELETE FROM paralelo WHERE PRLL_ID = p_PRLL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO paralelo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRLL_ID, PRLL_NOM, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_PRLL_ID, p_PRLL_NOM, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_PARAMETRO(
    IN p_PRMT_ID char(36),
    IN p_PRMT_NOM varchar(100),
    IN p_PRMT_DESCR varchar(300),
    IN p_PRMT_URL_IMG varchar(500),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla parametro
    INSERT INTO parametro (PRMT_ID, PRMT_NOM, PRMT_DESCR, PRMT_URL_IMG, ESTADO)
    VALUES (p_PRMT_ID, p_PRMT_NOM, p_PRMT_DESCR, p_PRMT_URL_IMG, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO parametro_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRMT_ID, PRMT_NOM, PRMT_DESCR, PRMT_URL_IMG, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_PRMT_ID, p_PRMT_NOM, p_PRMT_DESCR, p_PRMT_URL_IMG, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_PARAMETRO(
    IN p_PRMT_ID char(36),
    IN p_PRMT_NOM varchar(100),
    IN p_PRMT_DESCR varchar(300),
    IN p_PRMT_URL_IMG varchar(500),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla parametro
    UPDATE parametro
    SET PRMT_ID = p_PRMT_ID, PRMT_NOM = p_PRMT_NOM, PRMT_DESCR = p_PRMT_DESCR, PRMT_URL_IMG = p_PRMT_URL_IMG, ESTADO = p_ESTADO
    WHERE PRMT_ID = p_PRMT_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO parametro_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRMT_ID, PRMT_NOM, PRMT_DESCR, PRMT_URL_IMG, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_PRMT_ID, p_PRMT_NOM, p_PRMT_DESCR, p_PRMT_URL_IMG, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_PARAMETRO(
    IN p_PRMT_ID char(36),
    IN p_PRMT_NOM varchar(100),
    IN p_PRMT_DESCR varchar(300),
    IN p_PRMT_URL_IMG varchar(500),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del parametro antes de eliminar
    SELECT PRMT_ID, PRMT_NOM, PRMT_DESCR, PRMT_URL_IMG, ESTADO
    INTO @PRMT_ID, @PRMT_NOM, @PRMT_DESCR, @PRMT_URL_IMG, @ESTADO
    FROM parametro
    WHERE PRMT_ID = p_PRMT_ID;

    -- Realizar la eliminación en la tabla parametro
    DELETE FROM parametro WHERE PRMT_ID = p_PRMT_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO parametro_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRMT_ID, PRMT_NOM, PRMT_DESCR, PRMT_URL_IMG, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_PRMT_ID, p_PRMT_NOM, p_PRMT_DESCR, p_PRMT_URL_IMG, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_PARCIAL(
    IN p_PRCL_ID char(36),
    IN p_PRCL_NOM varchar(10),
    IN p_PRCL_INI date,
    IN p_PRCL_FIN date,
    IN p_ESTADO tinyint(1),
    IN p_PRCL_TIPO enum('normal','evaluativo'),
    IN p_PRD_ID char(36),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla parcial
    INSERT INTO parcial (PRCL_ID, PRCL_NOM, PRCL_INI, PRCL_FIN, ESTADO, PRCL_TIPO, PRD_ID)
    VALUES (p_PRCL_ID, p_PRCL_NOM, p_PRCL_INI, p_PRCL_FIN, p_ESTADO, p_PRCL_TIPO, p_PRD_ID);
    -- Insertar el registro en la tabla auditora
    INSERT INTO parcial_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRCL_ID, PRCL_NOM, PRCL_INI, PRCL_FIN, ESTADO, PRCL_TIPO, PRD_ID, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_PRCL_ID, p_PRCL_NOM, p_PRCL_INI, p_PRCL_FIN, p_ESTADO, p_PRCL_TIPO, p_PRD_ID, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_PARCIAL(
    IN p_PRCL_ID char(36),
    IN p_PRCL_NOM varchar(10),
    IN p_PRCL_INI date,
    IN p_PRCL_FIN date,
    IN p_ESTADO tinyint(1),
    IN p_PRCL_TIPO enum('normal','evaluativo'),
    IN p_PRD_ID char(36),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla parcial
    UPDATE parcial
    SET PRCL_ID = p_PRCL_ID, PRCL_NOM = p_PRCL_NOM, PRCL_INI = p_PRCL_INI, PRCL_FIN = p_PRCL_FIN, ESTADO = p_ESTADO, PRCL_TIPO = p_PRCL_TIPO, PRD_ID = p_PRD_ID
    WHERE PRCL_ID = p_PRCL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO parcial_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRCL_ID, PRCL_NOM, PRCL_INI, PRCL_FIN, ESTADO, PRCL_TIPO, PRD_ID, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_PRCL_ID, p_PRCL_NOM, p_PRCL_INI, p_PRCL_FIN, p_ESTADO, p_PRCL_TIPO, p_PRD_ID, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_PARCIAL(
    IN p_PRCL_ID char(36),
    IN p_PRCL_NOM varchar(10),
    IN p_PRCL_INI date,
    IN p_PRCL_FIN date,
    IN p_ESTADO tinyint(1),
    IN p_PRCL_TIPO enum('normal','evaluativo'),
    IN p_PRD_ID char(36),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del parcial antes de eliminar
    SELECT PRCL_ID, PRCL_NOM, PRCL_INI, PRCL_FIN, ESTADO, PRCL_TIPO, PRD_ID
    INTO @PRCL_ID, @PRCL_NOM, @PRCL_INI, @PRCL_FIN, @ESTADO, @PRCL_TIPO, @PRD_ID
    FROM parcial
    WHERE PRCL_ID = p_PRCL_ID;

    -- Realizar la eliminación en la tabla parcial
    DELETE FROM parcial WHERE PRCL_ID = p_PRCL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO parcial_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRCL_ID, PRCL_NOM, PRCL_INI, PRCL_FIN, ESTADO, PRCL_TIPO, PRD_ID, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_PRCL_ID, p_PRCL_NOM, p_PRCL_INI, p_PRCL_FIN, p_ESTADO, p_PRCL_TIPO, p_PRD_ID, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_PERIODO(
    IN p_PRD_ID char(36),
    IN p_PRD_NOM varchar(10),
    IN p_PRD_INI date,
    IN p_PRD_FIN date,
    IN p_PRD_TIPO enum('normal','suspenso'),
    IN p_AL_ID char(36),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla periodo
    INSERT INTO periodo (PRD_ID, PRD_NOM, PRD_INI, PRD_FIN, PRD_TIPO, AL_ID, ESTADO)
    VALUES (p_PRD_ID, p_PRD_NOM, p_PRD_INI, p_PRD_FIN, p_PRD_TIPO, p_AL_ID, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO periodo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRD_ID, PRD_NOM, PRD_INI, PRD_FIN, PRD_TIPO, AL_ID, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_PRD_ID, p_PRD_NOM, p_PRD_INI, p_PRD_FIN, p_PRD_TIPO, p_AL_ID, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_PERIODO(
    IN p_PRD_ID char(36),
    IN p_PRD_NOM varchar(10),
    IN p_PRD_INI date,
    IN p_PRD_FIN date,
    IN p_PRD_TIPO enum('normal','suspenso'),
    IN p_AL_ID char(36),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla periodo
    UPDATE periodo
    SET PRD_ID = p_PRD_ID, PRD_NOM = p_PRD_NOM, PRD_INI = p_PRD_INI, PRD_FIN = p_PRD_FIN, PRD_TIPO = p_PRD_TIPO, AL_ID = p_AL_ID, ESTADO = p_ESTADO
    WHERE PRD_ID = p_PRD_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO periodo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRD_ID, PRD_NOM, PRD_INI, PRD_FIN, PRD_TIPO, AL_ID, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_PRD_ID, p_PRD_NOM, p_PRD_INI, p_PRD_FIN, p_PRD_TIPO, p_AL_ID, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_PERIODO(
    IN p_PRD_ID char(36),
    IN p_PRD_NOM varchar(10),
    IN p_PRD_INI date,
    IN p_PRD_FIN date,
    IN p_PRD_TIPO enum('normal','suspenso'),
    IN p_AL_ID char(36),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del periodo antes de eliminar
    SELECT PRD_ID, PRD_NOM, PRD_INI, PRD_FIN, PRD_TIPO, AL_ID, ESTADO
    INTO @PRD_ID, @PRD_NOM, @PRD_INI, @PRD_FIN, @PRD_TIPO, @AL_ID, @ESTADO
    FROM periodo
    WHERE PRD_ID = p_PRD_ID;

    -- Realizar la eliminación en la tabla periodo
    DELETE FROM periodo WHERE PRD_ID = p_PRD_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO periodo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRD_ID, PRD_NOM, PRD_INI, PRD_FIN, PRD_TIPO, AL_ID, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_PRD_ID, p_PRD_NOM, p_PRD_INI, p_PRD_FIN, p_PRD_TIPO, p_AL_ID, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_PROFESOR_ASIGNATURA_PARALELO(
    IN p_PRF_ASG_PRLL_ID char(36),
    IN p_ASG_ID char(36),
    IN p_PRF_ID char(36),
    IN p_AL_ID char(36),
    IN p_CRS_ID char(36),
    IN p_PRLL_ID char(36),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla profesor_asignatura_paralelo
    INSERT INTO profesor_asignatura_paralelo (PRF_ASG_PRLL_ID, ASG_ID, PRF_ID, AL_ID, CRS_ID, PRLL_ID, ESTADO)
    VALUES (p_PRF_ASG_PRLL_ID, p_ASG_ID, p_PRF_ID, p_AL_ID, p_CRS_ID, p_PRLL_ID, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO profesor_asignatura_paralelo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRF_ASG_PRLL_ID, ASG_ID, PRF_ID, AL_ID, CRS_ID, PRLL_ID, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_PRF_ASG_PRLL_ID, p_ASG_ID, p_PRF_ID, p_AL_ID, p_CRS_ID, p_PRLL_ID, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_PROFESOR_ASIGNATURA_PARALELO(
    IN p_PRF_ASG_PRLL_ID char(36),
    IN p_ASG_ID char(36),
    IN p_PRF_ID char(36),
    IN p_AL_ID char(36),
    IN p_CRS_ID char(36),
    IN p_PRLL_ID char(36),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla profesor_asignatura_paralelo
    UPDATE profesor_asignatura_paralelo
    SET PRF_ASG_PRLL_ID = p_PRF_ASG_PRLL_ID, ASG_ID = p_ASG_ID, PRF_ID = p_PRF_ID, AL_ID = p_AL_ID, CRS_ID = p_CRS_ID, PRLL_ID = p_PRLL_ID, ESTADO = p_ESTADO
    WHERE PRF_ASG_PRLL_ID = p_PRF_ASG_PRLL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO profesor_asignatura_paralelo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRF_ASG_PRLL_ID, ASG_ID, PRF_ID, AL_ID, CRS_ID, PRLL_ID, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_PRF_ASG_PRLL_ID, p_ASG_ID, p_PRF_ID, p_AL_ID, p_CRS_ID, p_PRLL_ID, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_PROFESOR_ASIGNATURA_PARALELO(
    IN p_PRF_ASG_PRLL_ID char(36),
    IN p_ASG_ID char(36),
    IN p_PRF_ID char(36),
    IN p_AL_ID char(36),
    IN p_CRS_ID char(36),
    IN p_PRLL_ID char(36),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del profesor_asignatura_paralelo antes de eliminar
    SELECT PRF_ASG_PRLL_ID, ASG_ID, PRF_ID, AL_ID, CRS_ID, PRLL_ID, ESTADO
    INTO @PRF_ASG_PRLL_ID, @ASG_ID, @PRF_ID, @AL_ID, @CRS_ID, @PRLL_ID, @ESTADO
    FROM profesor_asignatura_paralelo
    WHERE PRF_ASG_PRLL_ID = p_PRF_ASG_PRLL_ID;

    -- Realizar la eliminación en la tabla profesor_asignatura_paralelo
    DELETE FROM profesor_asignatura_paralelo WHERE PRF_ASG_PRLL_ID = p_PRF_ASG_PRLL_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO profesor_asignatura_paralelo_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, PRF_ASG_PRLL_ID, ASG_ID, PRF_ID, AL_ID, CRS_ID, PRLL_ID, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_PRF_ASG_PRLL_ID, p_ASG_ID, p_PRF_ID, p_AL_ID, p_CRS_ID, p_PRLL_ID, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_USUARIO(
    IN p_USR_ID char(36),
    IN p_USR_DNI varchar(10),
    IN p_USR_NOM varchar(30),
    IN p_USR_NOM2 varchar(30),
    IN p_USR_APE varchar(30),
    IN p_USR_APE2 varchar(30),
    IN p_USR_DIR varchar(300),
    IN p_USR_TEL varchar(10),
    IN p_USR_CEL varchar(10),
    IN p_USR_EMAIL varchar(100),
    IN p_USR_FECH_NAC date,
    IN p_USR_GEN char(1),
    IN p_USUARIO varchar(30),
    IN p_USR_PSWD varchar(300),
    IN p_ROL_PRF tinyint(1),
    IN p_ROL_REPR tinyint(1),
    IN p_ROL_ADMIN tinyint(1),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla usuario
    INSERT INTO usuario (USR_ID, USR_DNI, USR_NOM, USR_NOM2, USR_APE, USR_APE2, USR_DIR, USR_TEL, USR_CEL, USR_EMAIL, USR_FECH_NAC, USR_GEN, USUARIO, USR_PSWD, ROL_PRF, ROL_REPR, ROL_ADMIN, ESTADO)
    VALUES (p_USR_ID, p_USR_DNI, p_USR_NOM, p_USR_NOM2, p_USR_APE, p_USR_APE2, p_USR_DIR, p_USR_TEL, p_USR_CEL, p_USR_EMAIL, p_USR_FECH_NAC, p_USR_GEN, p_USUARIO, p_USR_PSWD, p_ROL_PRF, p_ROL_REPR, p_ROL_ADMIN, p_ESTADO);
    -- Insertar el registro en la tabla auditora
    INSERT INTO usuario_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, USR_ID, USR_DNI, USR_NOM, USR_NOM2, USR_APE, USR_APE2, USR_DIR, USR_TEL, USR_CEL, USR_EMAIL, USR_FECH_NAC, USR_GEN, USUARIO, USR_PSWD, ROL_PRF, ROL_REPR, ROL_ADMIN, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_USR_ID, p_USR_DNI, p_USR_NOM, p_USR_NOM2, p_USR_APE, p_USR_APE2, p_USR_DIR, p_USR_TEL, p_USR_CEL, p_USR_EMAIL, p_USR_FECH_NAC, p_USR_GEN, p_USUARIO, p_USR_PSWD, p_ROL_PRF, p_ROL_REPR, p_ROL_ADMIN, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_USUARIO(
    IN p_USR_ID char(36),
    IN p_USR_DNI varchar(10),
    IN p_USR_NOM varchar(30),
    IN p_USR_NOM2 varchar(30),
    IN p_USR_APE varchar(30),
    IN p_USR_APE2 varchar(30),
    IN p_USR_DIR varchar(300),
    IN p_USR_TEL varchar(10),
    IN p_USR_CEL varchar(10),
    IN p_USR_EMAIL varchar(100),
    IN p_USR_FECH_NAC date,
    IN p_USR_GEN char(1),
    IN p_USUARIO varchar(30),
    IN p_USR_PSWD varchar(300),
    IN p_ROL_PRF tinyint(1),
    IN p_ROL_REPR tinyint(1),
    IN p_ROL_ADMIN tinyint(1),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla usuario
    UPDATE usuario
    SET USR_ID = p_USR_ID, USR_DNI = p_USR_DNI, USR_NOM = p_USR_NOM, USR_NOM2 = p_USR_NOM2, USR_APE = p_USR_APE, USR_APE2 = p_USR_APE2, USR_DIR = p_USR_DIR, USR_TEL = p_USR_TEL, USR_CEL = p_USR_CEL, USR_EMAIL = p_USR_EMAIL, USR_FECH_NAC = p_USR_FECH_NAC, USR_GEN = p_USR_GEN, USUARIO = p_USUARIO, USR_PSWD = p_USR_PSWD, ROL_PRF = p_ROL_PRF, ROL_REPR = p_ROL_REPR, ROL_ADMIN = p_ROL_ADMIN, ESTADO = p_ESTADO
    WHERE USR_ID = p_USR_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO usuario_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, USR_ID, USR_DNI, USR_NOM, USR_NOM2, USR_APE, USR_APE2, USR_DIR, USR_TEL, USR_CEL, USR_EMAIL, USR_FECH_NAC, USR_GEN, USUARIO, USR_PSWD, ROL_PRF, ROL_REPR, ROL_ADMIN, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_USR_ID, p_USR_DNI, p_USR_NOM, p_USR_NOM2, p_USR_APE, p_USR_APE2, p_USR_DIR, p_USR_TEL, p_USR_CEL, p_USR_EMAIL, p_USR_FECH_NAC, p_USR_GEN, p_USUARIO, p_USR_PSWD, p_ROL_PRF, p_ROL_REPR, p_ROL_ADMIN, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_USUARIO(
    IN p_USR_ID char(36),
    IN p_USR_DNI varchar(10),
    IN p_USR_NOM varchar(30),
    IN p_USR_NOM2 varchar(30),
    IN p_USR_APE varchar(30),
    IN p_USR_APE2 varchar(30),
    IN p_USR_DIR varchar(300),
    IN p_USR_TEL varchar(10),
    IN p_USR_CEL varchar(10),
    IN p_USR_EMAIL varchar(100),
    IN p_USR_FECH_NAC date,
    IN p_USR_GEN char(1),
    IN p_USUARIO varchar(30),
    IN p_USR_PSWD varchar(300),
    IN p_ROL_PRF tinyint(1),
    IN p_ROL_REPR tinyint(1),
    IN p_ROL_ADMIN tinyint(1),
    IN p_ESTADO tinyint(1),
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del usuario antes de eliminar
    SELECT USR_ID, USR_DNI, USR_NOM, USR_NOM2, USR_APE, USR_APE2, USR_DIR, USR_TEL, USR_CEL, USR_EMAIL, USR_FECH_NAC, USR_GEN, USUARIO, USR_PSWD, ROL_PRF, ROL_REPR, ROL_ADMIN, ESTADO
    INTO @USR_ID, @USR_DNI, @USR_NOM, @USR_NOM2, @USR_APE, @USR_APE2, @USR_DIR, @USR_TEL, @USR_CEL, @USR_EMAIL, @USR_FECH_NAC, @USR_GEN, @USUARIO, @USR_PSWD, @ROL_PRF, @ROL_REPR, @ROL_ADMIN, @ESTADO
    FROM usuario
    WHERE USR_ID = p_USR_ID;

    -- Realizar la eliminación en la tabla usuario
    DELETE FROM usuario WHERE USR_ID = p_USR_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO usuario_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, USR_ID, USR_DNI, USR_NOM, USR_NOM2, USR_APE, USR_APE2, USR_DIR, USR_TEL, USR_CEL, USR_EMAIL, USR_FECH_NAC, USR_GEN, USUARIO, USR_PSWD, ROL_PRF, ROL_REPR, ROL_ADMIN, ESTADO, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_USR_ID, p_USR_DNI, p_USR_NOM, p_USR_NOM2, p_USR_APE, p_USR_APE2, p_USR_DIR, p_USR_TEL, p_USR_CEL, p_USR_EMAIL, p_USR_FECH_NAC, p_USR_GEN, p_USUARIO, p_USR_PSWD, p_ROL_PRF, p_ROL_REPR, p_ROL_ADMIN, p_ESTADO, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE INSERT_USUARIO_PROFESOR(
    IN p_USR_ID char(36),
    IN p_PRF_FECH_INGR_INST date,
    IN p_PRF_FECH_INGR_MAG date,
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la inserción en la tabla usuario_profesor
    INSERT INTO usuario_profesor (USR_ID, PRF_FECH_INGR_INST, PRF_FECH_INGR_MAG)
    VALUES (p_USR_ID, p_PRF_FECH_INGR_INST, p_PRF_FECH_INGR_MAG);
    -- Insertar el registro en la tabla auditora
    INSERT INTO usuario_profesor_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, USR_ID, PRF_FECH_INGR_INST, PRF_FECH_INGR_MAG, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'INSERT', p_USER_ID, p_USR_ID, p_PRF_FECH_INGR_INST, p_PRF_FECH_INGR_MAG, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE UPDATE_USUARIO_PROFESOR(
    IN p_USR_ID char(36),
    IN p_PRF_FECH_INGR_INST date,
    IN p_PRF_FECH_INGR_MAG date,
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Realizar la actualización en la tabla usuario_profesor
    UPDATE usuario_profesor
    SET USR_ID = p_USR_ID, PRF_FECH_INGR_INST = p_PRF_FECH_INGR_INST, PRF_FECH_INGR_MAG = p_PRF_FECH_INGR_MAG
    WHERE USR_ID = p_USR_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO usuario_profesor_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, USR_ID, PRF_FECH_INGR_INST, PRF_FECH_INGR_MAG, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'UPDATE', p_USER_ID, p_USR_ID, p_PRF_FECH_INGR_INST, p_PRF_FECH_INGR_MAG, CURRENT_TIMESTAMP);
END //

DELIMITER ;

DELIMITER //

CREATE PROCEDURE DELETE_USUARIO_PROFESOR(
    IN p_USR_ID char(36),
    IN p_PRF_FECH_INGR_INST date,
    IN p_PRF_FECH_INGR_MAG date,
    IN p_USER_ID CHAR(36)
)
BEGIN
    -- Obtener datos del usuario_profesor antes de eliminar
    SELECT USR_ID, PRF_FECH_INGR_INST, PRF_FECH_INGR_MAG
    INTO @USR_ID, @PRF_FECH_INGR_INST, @PRF_FECH_INGR_MAG
    FROM usuario_profesor
    WHERE USR_ID = p_USR_ID;

    -- Realizar la eliminación en la tabla usuario_profesor
    DELETE FROM usuario_profesor WHERE USR_ID = p_USR_ID;
    -- Insertar el registro en la tabla auditora
    INSERT INTO usuario_profesor_AUDIT (AUDIT_DATE, AUDIT_OPERATION, USER_ID, USR_ID, PRF_FECH_INGR_INST, PRF_FECH_INGR_MAG, FECHA_CREACION)
    VALUES (CURRENT_TIMESTAMP, 'DELETE', p_USER_ID, p_USR_ID, p_PRF_FECH_INGR_INST, p_PRF_FECH_INGR_MAG, CURRENT_TIMESTAMP);
END //

DELIMITER ;

