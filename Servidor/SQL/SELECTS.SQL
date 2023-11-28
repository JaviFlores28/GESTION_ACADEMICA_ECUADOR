SELECT E.EST_ID AS ID, E.EST_DNI, CONCAT(E.EST_NOM, ' ', E.EST_NOM2, ' ', E.EST_APE, ' ', E.EST_APE2) AS EST_NOM, CONCAT(U.USR_NOM, ' ', U.USR_NOM2, ' ', U.USR_APE, ' ', U.USR_APE2) AS REPRESENTANTE, E.ESTADO FROM ESTUDIANTE AS E JOIN USUARIO AS U ON E.REPR_ID = U.USR_ID;
SELECT b.EST_NOM, c.CRS_NOM, a.* FROM `estudiante_curso` as a JOIN estudiante as b ON a.EST_ID=b.EST_ID JOIN curso as c ON a.CRS_ID= c.CRS_ID;
SELECT a.* FROM estudiante AS a WHERE NOT EXISTS ( SELECT 1 FROM estudiante_curso AS b WHERE b.EST_ID = a.EST_ID AND b.ESTADO = 1 ) AND a.ESTADO = 1;

SELECT a.* FROM `vista_profesor_asignatura_paralelo` as a JOIN profesor_asignatura_paralelo as b ON a.PRF_ASG_PRLL_ID = b.PRF_ASG_PRLL_ID WHERE b.ESTADO = 1 AND b.AL_ID = '090f8103-fffd-4216-ae64-8f2a843387ff' AND b.PRF_ID = 'a8ace72a-77b1-456c-a2dc-c5c3799407e9';

SHOW KEYS FROM ${tableName} WHERE Key_name = 'PRIMARY'