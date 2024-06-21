import fs from 'node:fs/promises';
import { add_migration, query, remove_migration } from './drivers/interface.js';
import { migration_status } from './status.js';
import chalk from 'chalk';

export async function handle(flags, op) {
    const migrations = await migration_status();

    let migrations_ran = 0;

    // for rollback, reverse the order
    if (op === 'rollback') {
        migrations.reverse();
    }

    for (const migration of migrations) {
        if (op === 'migrate' && migration.ran) {
            continue;
        }

        if (op === 'rollback' && !migration.ran) {
            continue;
        }

        migrations_ran += 1;

        // handles -f flag
        if (flags.transaction) {
            await query('start transaction');
        }

        const op_word = op === 'migrate' ? 'applying: ' : 'removing: ';

        console.log(`${chalk.yellow(op_word)}${migration.name}`);

        const contents = await fs.readFile(`migrations/${migration.name}`);

        const lines = contents.toString().split('\n');

        // remove all lines not related to the up
        let found = false;
        let queries = '';

        for (const line of lines) {
            if (op === 'migrate') {
                if (line.startsWith('up:')) {
                    found = true;
                    continue;
                }

                if (line.startsWith('down:')) {
                    break;
                }
            }

            if (op === 'rollback') {
                if (line.startsWith('down:')) {
                    found = true;
                    continue;
                }
            }

            if (!found) {
                continue;
            }

            queries += `${line}\n`;
        }

        // this will help find query boundaries in case the user doesn't use
        // a newline on every line
        queries += '\n';

        const queries_to_execute = extract_queries(queries);

        for (const q of queries_to_execute) {
            await query(q);
        }

        console.log(`${chalk.green('finished:')} ${migration.name}`);

        // handles -f flag
        if (flags.transaction) {
            await query('commit');
        }

        if (op === 'migrate') {
            await add_migration(migration.name);
        } else {
            await remove_migration(migration.name);
        }

        // for rollback, at the moment, stop after the first one
        if (op === 'rollback') {
            break;
        }
    }

    if (migrations_ran === 0) {
        console.log(op === 'migrate' ? 'all migrations are already applied' : 'all migrations are already removed');
    }
}

function extract_queries(queries) {
    const result = [];
    let temp = '';
    let delimiter = ';';
    let delimiter_check = true;

    for (let i = 0; i < queries.length; i++) {
        if (delimiter_check) {
            delimiter_check = false;

            const test = queries.substring(i).toLowerCase();
            if (test.startsWith('delimiter ')) {
                delimiter = queries[i + 10];
                i += 11;
                continue;
            }
        }

        if (queries[i] === '\n') {
            delimiter_check = true;
        }

        if (i === queries.length - 1) {
            temp += queries[i];
            if (temp.trim()) {
                result.push(temp.trim());
            }
            break;
        }

        if (queries[i] === delimiter && queries[i + 1] === '\n') {
            temp += delimiter;
            result.push(temp.trim());
            temp = '';
            i++;
            continue;
        }

        temp += queries[i];
    }

    return result;
}
