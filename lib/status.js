import chalk from 'chalk';
import fs from 'fs/promises';
import { get_migration_list } from './drivers/interface.js';

export async function handle() {
    const local_migrations = await migration_status();

    let pending_migrations = 0;

    for (const migration of local_migrations) {
        if (migration.ran) {
            console.log(`${chalk.green('up - ')}${migration.name}`);
        } else {
            pending_migrations += 1;
            console.log(`${chalk.red('dn - ')}${migration.name}`);
        }
    }

    if (pending_migrations > 0) {
        console.log(
            `you have ${pending_migrations} pending migration${pending_migrations === 1 ? '' : 's'}, run 'jmig migrate' to apply ${pending_migrations === 1 ? 'it' : 'them'}`
        );
    }
}

export async function migration_status() {
    const migrations = await get_migration_list();

    let files = await fs.readdir('migrations');

    files = files.filter(file => !file.startsWith('.')).sort();

    const local_migrations = files.map(file => {
        const ran = migrations.some(migration => migration.name === file);

        return {
            name: file,
            ran
        };
    });

    return local_migrations;
}
