const EventEmitter = require('events');
const readLine = require('readline');
const configCLI = require('./serverCLI');
const { getCommandArgs } = require('./utilities')
require('./miniTask');

const user = new EventEmitter();
const CLI = configCLI.linux(user);

const lineReader = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: "NodeCLI>"
});


lineReader.on('line', (data) => {
    user.emit('command', getCommandArgs(data));
    lineReader.prompt();
});

CLI.on('response', (res) => {
    console.log(`\n${res}`);
    lineReader.prompt();
});

CLI.on('clear', () => {
    process.stdout.write('\033c');
});