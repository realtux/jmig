import chalk from 'chalk';
import mysql from 'mysql2/promise';
import { load as load_config } from '../config.js';

let connection;

async function get_connection() {
    if (connection) {
        return connection;
    }

    const config = await load_config();

    console.log(
        chalk.cyan(`driver:`),
        config.platform,
        chalk.cyan(`endpoint:`),
        `${config.username}@${config.host}/${config.db}`,
    );

    const conn_url = `mysql://${config.username}:${config.password}@${config.host}:${config.port}/${config.db}`;

    try {
        connection = await mysql.createConnection(conn_url);

        // add the jmig table in case it doesn't exist
        await connection.query(`
            create table if not exists jmig (
                name varchar(255) not null,
                primary key(name)
            ) engine=innodb default charset=utf8
        `);
    } catch (error) {
        console.error('failed to connect to database');
        process.exit();
    }

    return connection;
}

export async function query(query) {
    const connection = await get_connection();

    try {
        await connection.query(query);
    } catch (error) {
        console.error(chalk.red('error:'), error.message);
    }
}

export async function get_migration_list() {
    const connection = await get_connection();

    try {
        const [rows] = await connection.query('select * from jmig');
        return rows.map(row => ({ name: row.name, ran: true }));
    } catch (error) {
        console.log(chalk.red('unknown error'));
        return [];
    }
}
