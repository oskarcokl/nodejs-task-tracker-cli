#!/usr/bin/env node

import { exit } from 'process';
import fs from 'fs';
import { pathToFileURL } from 'url';

// GLOBALS
const dbPath = 'db.json';
// TODO: Check how to build this as a CLI application.

function main() {
    if (process.argv.length == 2) {
        // no command was provided print help message
        printHelpMessage();
        // Exit with error?
        exit(1);
    }

    if (!fs.existsSync(dbPath)) {
        console.log("DB file doesn't exist");
        createDb();
    }
    // TODO: Parse db.json file

    // list of commands to support
    // add
    // update
    // delete
    // mark-in-progress
    // mark-done
    // list
    // if the command is not one of this throw error or display helpful information

    const command = process.argv[2];

    switch (command) {
        case 'add':
            addTask(process.argv[3]);
            break;
        case 'update':
            break;
        case 'delete':
            break;
        case 'mark-in-progress':
            break;
        case 'mark-done':
            break;
        case 'list':
            break;
        default:
            console.error('Use a valid command');
            printHelpMessage();
            exit(1);
    }
    //# sourceMappingURL=main.js.map
}

function addTask(description: string) {
    if (typeof description === 'undefined') {
        console.log('A description must be provided to add a task');
        exit(1);
    }
}

function createDb() {
    console.log('creating DB');
    try {
        fs.writeFileSync(dbPath, '{}', { flag: 'w+' });
    } catch (error) {
        console.log(error);
    }
}

function printHelpMessage() {
    console.log('You should provide the tool with a command');
}

main();
