#!/usr/bin/env node

import { exit } from 'process';
import fs from 'fs';

type DB = {
    tasks: Task[];
};

type Task = {
    id: number;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    // maybe format to a string?
    createAd: Date;
    updatedAd: Date;
};

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
    // This will also create the db.json file if it doesn't exist.
    const db = JSON.parse(fs.readFileSync(dbPath, { flag: 'rs', encoding: 'utf-8' }));

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
            addTask(db, process.argv[3]);
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

function addTask(db: DB, description: string) {
    if (typeof description === 'undefined') {
        console.log('A description must be provided to add a task');
        exit(1);
    }

    const maxId = db.tasks.reduce((pId, t) => Math.max(pId, t.id), 0);

    // create a task object
    const newTask: Task = {
        id: maxId + 1,
        description: description,
        status: 'todo',
        createAd: new Date(),
        updatedAd: new Date(),
    };
    // write the task object to the file
    db.tasks.push(newTask);
    fs.writeFileSync(dbPath, JSON.stringify(db));
    // write that creating of task was successful
    console.log(` Task added successfully (ID: ${newTask.id})`);
}

function createDb() {
    console.log('creating DB');
    try {
        fs.writeFileSync(dbPath, '{"tasks": []}', { flag: 'w+' });
    } catch (error) {
        console.log(error);
    }
}

function printHelpMessage() {
    console.log('You should provide the tool with a command');
}

main();
