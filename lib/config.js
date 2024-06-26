import dotenv from 'dotenv';
import dotenv_expand from 'dotenv-expand';
import fs from 'node:fs/promises';
import path from 'path';

let de = dotenv.config();
dotenv_expand.expand(de);

export async function load() {
    const config_path = path.join(process.cwd(), 'config.json');

    if (await exists()) {
        try {
            const contents = await fs.readFile(config_path, 'utf8');
            const config = JSON.parse(contents);

            return config;
        } catch (error) {
            console.error('problem parsing config, recommend `jmig init -f` to redo');
            process.exit(1);
        }
    } else {
        return {
            driver: process.env.JMIG_DRIVER || '',
            host: process.env.JMIG_HOST || '',
            port: +process.env.JMIG_PORT || 0,
            username: process.env.JMIG_USERNAME || '',
            password: process.env.JMIG_PASSWORD || '',
            db: process.env.JMIG_DB || ''
        };
    }
}

export async function exists() {
    try {
        const config_path = path.join(process.cwd(), 'config.json');
        await fs.access(config_path);

        return true;
    } catch {
        return false;
    }
}
