import chalk from 'chalk';
import { load as load_config } from '../config.js';
import pgpkg from 'pg';
const { Client } = pgpkg;

let connection;

async function get_connection() {
    if (connection) {
        return connection;
    }

    const config = await load_config();

    console.log(
        chalk.cyan(`driver:`),
        config.driver,
        chalk.cyan(`endpoint:`),
        `${config.username}@${config.host}/${config.db}`,
    );

    const conn_url = `postgresql://${config.user}:${config.pass}@${config.host}:${config.port}/${config.db}`;

    try {
        connection = new Client({ connectionString: conn_url });
        await connection.connect();

        // add the jmig table in case it doesn't exist
        await connection.query(`
            create table if not exists jmig (
                name varchar(255) not null,
                primary key(name)
            );
        `);

    } catch (error) {
        console.error('failed to connect to database');
        process.exit(1);
    }

    return connection;
}

export async function query(query) {
    const conn = await get_connection();

    try {
        await conn.query(query);
    } catch (error) {
        console.error(chalk.red('error:'), error.message);
    }
}

export async function get_migration_list() {
    const conn = await get_connection();

    const res = await conn.query('select * from jmig');

    return res.rows.map(row => ({ name: row.name, ran: true }));
}
