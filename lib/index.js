import { handle as init_handle } from './init.js';
import { handle as status_handle } from './status.js';
import { handle as create_handle } from './create.js';
import { handle as migrations_handle } from './migrations.js';

export default {

    async run() {
        console.log('jmig 0.0.2 by tux');

        let args = process.argv;

        if (args.length < 3) {
            menu();
            process.exit(1);
        }

        const command = args[2];

        let force = false;
        let transaction = false;
        let all = false;

        for (let arg of args) {
            switch (command) {
                case 'init':
                    if (arg === '-f') {
                        force = true;
                    }
                    break;
                case 'migrate':
                    if (arg === '-t') {
                        transaction = true;
                    }
                    break;
                case 'rollback':
                    if (arg === '-a') {
                        all = true;
                    }
                    break;
                default:
                    break;
            }
        }

        const flags = {
            force,
            transaction,
            all
        };

        switch (command) {
            case 'init':
                await init_handle(flags);
                break;
            case 'status':
                await status_handle();
                break;
            case 'create':
                await create_handle(args);
                break;
            case 'migrate':
                await migrations_handle(flags, 'migrate');
                break;
            case 'rollback':
                await migrations_handle(flags, 'rollback');
                break;
            default:
                menu();
                break;
        }

        console.log('');
    }

}

const menu = () => {
    console.log('usage: jmig command');
    console.log('    init');
    console.log('        create the initial jmig structure and config');
    console.log('');
    console.log('    status');
    console.log('        see the status of all migrations');
    console.log('');
    console.log('    create [name]');
    console.log('        create a new migration');
    console.log('');
    console.log('    migrate');
    console.log('        run all available migrations');
    console.log('');
    console.log('    rollback');
    console.log('        rollback the last migration');
};
