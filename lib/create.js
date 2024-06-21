import fs from 'node:fs/promises';
import { DateTime } from 'luxon';

export async function handle(args) {
    // check for missing args for the migration
    if (args.length < 3) {
        console.log('You must supply a name for your migration');
        process.exit(1);
    }

    let filename = DateTime.now().toFormat('yyyyMMddHHmmss')

    filename += '-';

    filename += args.slice(3).join('-');

    filename += '.sql';

    // desired output is 00000000000000-arg1-arg2-arg3-arg4.sql
    try {
        await fs.writeFile(`migrations/${filename}`, 'up:\n\n\ndown:\n\n');
    } catch (error) {
        console.error('Problem creating new migration');
        process.exit(1);
    }
}
