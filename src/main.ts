#!/usr/bin/env node

import { exit } from 'process';
import fs from 'fs';

type DB = {
    tasks: Task[];
};

type TaskStatus = 'todo' | 'in-progress' | 'done';

type Task = {
    id: number;
    description: string;
    status: TaskStatus;
    // maybe format to a string?
    created: Date;
    updated: Date;
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
            updateTask(db, parseInt(process.argv[3]), process.argv[4]);
            break;
        case 'delete':
            deleteTask(db, parseInt(process.argv[3]));
            break;
        case 'mark-in-progress':
            markTaskInProgress(db, parseInt(process.argv[3]));
            break;
        case 'mark-done':
            markTaskDone(db, parseInt(process.argv[3]));
            break;
        case 'list':
            const statusArg = process.argv[3];
            if (!statusArg || ['todo', 'in-progress', 'done'].includes(statusArg)) {
                listTasks(db, statusArg as TaskStatus);
            } else {
                console.log('Invalid status. Must be one of: todo, in-progress, done');
                exit(1);
            }
            break;
        default:
            console.error('Use a valid command');
            printHelpMessage();
            exit(1);
    }
}

function addTask(db: DB, description: string) {
    if (typeof description === 'undefined') {
        console.log('A description must be provided to add a task');
        exit(1);
    }

    const maxId = db.tasks.reduce((pId, t) => Math.max(pId, t.id), 0);

    const newTask: Task = {
        id: maxId + 1,
        description: description,
        status: 'todo',
        created: new Date(),
        updated: new Date(),
    };

    db.tasks.push(newTask);

    fs.writeFileSync(dbPath, JSON.stringify(db));
    console.log(` Task added successfully (ID: ${newTask.id})`);
}

function updateTask(db: DB, id: number, description: string) {
    if (typeof description === 'undefined') {
        console.log('A description must be provided to update a task');
        exit(1);
    }

    if (typeof id === 'undefined' || isNaN(id)) {
        console.log('An id must be provided to update a task');
        exit(1);
    }

    const task = db.tasks.find((t) => t.id === id);

    if (!task) {
        console.log('A task with the provided ID does not exist');
        exit(1);
    }

    task.description = description;
    task.updated = new Date();

    fs.writeFileSync(dbPath, JSON.stringify(db));
    console.log(`Task updated successfully (ID: ${id})`);
}

function deleteTask(db: DB, id: number) {
    if (typeof id === 'undefined' || isNaN(id)) {
        console.log('An id must be provided to delete a task');
        exit(1);
    }

    const tasks = db.tasks.filter((t) => t.id != id);

    db.tasks = tasks;

    fs.writeFileSync(dbPath, JSON.stringify(db));
    console.log(`Deleted task (ID: ${id})`);
}

function markTaskInProgress(db: DB, id: number) {
    if (typeof id === 'undefined' || isNaN(id)) {
        console.log('An id must be provided to mark task as in progress');
        exit(1);
    }

    const task = db.tasks.find((t) => t.id === id);

    if (!task) {
        console.log('A task with the provided ID does not exist');
        exit(1);
    }

    task.status = 'in-progress';

    fs.writeFileSync(dbPath, JSON.stringify(db));
    console.log(`Task set to in progress (ID: ${id})`);
}

function markTaskDone(db: DB, id: number) {
    if (typeof id === 'undefined' || isNaN(id)) {
        console.log('An id must be provided to mark task as done');
        exit(1);
    }

    const task = db.tasks.find((t) => t.id === id);

    if (!task) {
        console.log('A task with the provided ID does not exist');
        exit(1);
    }

    task.status = 'done';

    fs.writeFileSync(dbPath, JSON.stringify(db));
    console.log(`Task set to done (ID: ${id})`);
}

function listTasks(db: DB, status?: TaskStatus) {
    let tasks;

    switch (status) {
        case 'todo':
            tasks = db.tasks.filter((t) => t.status === 'todo');
            break;
        case 'in-progress':
            tasks = db.tasks.filter((t) => t.status === 'in-progress');
            break;
        case 'done':
            tasks = db.tasks.filter((t) => t.status === 'done');
            break;
        default:
            tasks = db.tasks;
            break;
    }

    tasks.forEach((task) => console.log(task));
}

function createDb() {
    console.log('creating DB');
    try {
        fs.writeFileSync(dbPath, '{"tasks": []}', { flag: 'w+' });
    } catch (error) {
        console.log(error);
    }
}

const helpMessage = `
You can use this script to manage your tasks

Usage:
    main.js <command-name> <option/s>

Commands:
    add <description>
    update <task-id> <description>
    delete <task-id>
    mark-in-progress <task-id>
    mark-done <task-id>
    list [<status>]
`;
function printHelpMessage() {
    console.log(helpMessage);
}

main();
