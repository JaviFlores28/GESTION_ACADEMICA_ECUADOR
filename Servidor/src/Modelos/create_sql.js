const fs = require('fs');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'uefbc_desarrollo'
});

connection.connect();

const generateQueries = async () => {
    let allQueries = '';

    const tables = await new Promise((resolve, reject) => {
        connection.query('SHOW TABLES', (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });

    for (const table of tables) {
        const tableName = table[`Tables_in_${connection.config.database}`];
        const capitalizedTableName = tableName.replace(/(_\w)/g, m => m[1].toUpperCase()).replace(/^\w/, c => c.toUpperCase());

        const columns = await new Promise((resolve, reject) => {
            connection.query(`SHOW COLUMNS FROM ${tableName}`, (error, results, fields) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });

        let primaryKey = null;
        let columnNames = [];
        let insertParams = '';
        let skipFechaCreacion = false;

        columns.forEach(column => {
            columnNames.push(column.Field);
            if (column.Key === 'PRI') {
                primaryKey = column.Field;
            }
            if (column.Field === 'FECHA_CREACION') {
                skipFechaCreacion = true;
            }
        });

        if (!primaryKey) {
            throw new Error(`No se encontró una clave primaria para la tabla ${tableName}`);
        }

        if (skipFechaCreacion) {
            columnNames = columnNames.filter(col => col !== 'FECHA_CREACION');
        }

        insertParams = columnNames.map(() => '?').join(', ');

        const sqlSearch = `SQL_SEARCH_${tableName.toUpperCase()}='SELECT * FROM ${tableName} WHERE ${primaryKey}= ?;'`;
        const sqlInsert = `SQL_INSERT_${tableName.toUpperCase()}='INSERT INTO ${tableName}(${columnNames.join(',')}) VALUES (${insertParams});'`;
        const sqlSelect = `SQL_SELECT_${tableName.toUpperCase()}='SELECT * FROM ${tableName};'`;
        const sqlUpdate = `SQL_UPDATE_${tableName.toUpperCase()}='UPDATE ${tableName} SET ${columnNames.map(col => `${col}= ?`).join(',')} WHERE ${primaryKey}= ?;'`;

        const content = `
${sqlSearch}
${sqlInsert}
${sqlSelect}
${sqlUpdate}
`;
        allQueries += content;
    }

    fs.writeFileSync(`sql/AllQueries.env`, allQueries, 'utf8');
    connection.end();
};

generateQueries().catch(error => {
    console.error(error);
});