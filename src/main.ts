#!/usr/bin/env node

import { exit } from 'process';

// TODO: Check how to build this as a CLI application.

if (process.argv.length == 2) {
    // no command was provided print help message
    printHelpMessage();
    // Exit with error?
    exit(1);
}

// list of commands to support
// add
// update
// delete
// mark-in-progress
// mark-done
// list
// if the command is not one of this throw error or display helpful information

const command = process.argv[2];

//# sourceMappingURL=main.js.map

function printHelpMessage() {
    console.log('You should provide the tool with a command');
}
