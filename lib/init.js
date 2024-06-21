import fs from 'node:fs/promises';
import { createInterface } from 'readline';
import { exists as config_exists } from './config.js';

const rl = createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

export async function handle(flags) {
    console.log('beginning init process..');

    if (!flags.force) {
        if (await config_exists()) {
            console.log('config already exists, use -f to force/overwrite');
            process.exit(1);
        }
    }

    console.log('database platform:');
    console.log('  [1] mysql');
    console.log('  [2] postgres');
    console.log('');
    const platform_input = await question('choice [1]: ');

    const platform = (() => {
        switch (parseInt(platform_input)) {
            case 1:
                return 'mysql';
            case 2:
                return 'postgres';
            default:
                return 'mysql';
        }
    })();

    const host = await question('host [localhost]: ') || 'localhost';

    const default_port = platform === 'mysql' ? 3306 : 5432;

    const port_input = await question(`port [${default_port}]: `);
    const port = parseInt(port_input) || default_port;

    const username = await question('database username [root]: ') || 'root';
    const password = await question('database password [root]: ') || 'root';
    const db = await question('database name: ');

    rl.close();

    const config = {
        host,
        port,
        username,
        password,
        db,
        platform
    };

    const config_string = JSON.stringify(config, null, 4);

    try {
        await fs.writeFile('config.json', config_string);
    } catch (error) {
        console.error('problem creating new config file');
        process.exit(1);
    }

    await fs.mkdir('migrations');
}
