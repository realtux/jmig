import { load as load_config } from '../config.js';
import { query as mysql_query, get_migration_list as mysql_get_migration_list } from './mysql.js';
import { query as postgres_query, get_migration_list as postgres_get_migration_list } from './postgres.js';

export async function query(query) {
    const config = await get_config();

    switch (config.platform) {
        case 'mysql':
            await mysql_query(query);
            break;
        case 'postgres':
            await postgres_query(query);
            break;
        default:
            break;
    }
}

export async function get_migration_list() {
    const config = await get_config();

    switch (config.platform) {
        case 'mysql':
            return await mysql_get_migration_list();
        case 'postgres':
            return await postgres_get_migration_list();
        default:
            return [];
    }
}

export async function add_migration(name) {
    const config = await get_config();

    switch (config.platform) {
        case 'mysql':
            await mysql_query(`insert into jmig values ('${name}')`);
            break;
        case 'postgres':
            await postgres_query(`insert into jmig values ('${name}')`);
            break;
        default:
            break;
    }
}

export async function remove_migration(name) {
    const config = await get_config();

    switch (config.platform) {
        case 'mysql':
            await mysql_query(`delete from jmig where name = '${name}'`);
            break;
        case 'postgres':
            await postgres_query(`delete from jmig where name = '${name}'`);
            break;
        default:
            break;
    }
}

async function get_config() {
    const config = await load_config();

    // verify platform is valid
    const valid_platforms = ['mysql', 'postgres'];

    if (!valid_platforms.includes(config.platform)) {
        console.log(`platform \`${config.platform}\` not supported by jmig`);
        console.log('currently supported platforms: mysql, postgres');
        process.exit(1);
    }

    return config;
}
