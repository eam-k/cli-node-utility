const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { diffFiles, readFileLines } = require('./utilities')

function ls(currentPath) {
    return fs.readdirSync(currentPath).join(" ");
}

function cd(args, currentDir) {
    switch (args[0]) {
        case undefined:
        case '':
            console.log('Path must be a string');
            return path.join(currentDir);
        case "..":
            return path.join(currentDir, '..');
        case ".":
            return path.join(__dirname);
        default:
            if (fs.existsSync(path.join(currentDir, args[0]))) {
                return path.join(currentDir, args[0]);
            }
    }
}

function diff(args, currentDir, callback) {
    if (!args.length) {
        callback(`diff needs at least two file paths, example 'diff ./file1.txt ./file2.txt'`);
        return
    }
    const commands = [];
    const paths = [];
    args
        .filter(arg => !!arg && arg !== "" && arg !== " ")
        .forEach(arg => {
            if (fs.existsSync(path.join(currentDir, arg))) {
                paths.push(arg)
            } else {
                callback('Path does not exist', path.join(currentDir, arg));
                commands.push(arg)
            }
        });
    if (commands.length < 1) {
        callback('Please use one command');
        return;
    }
    if (paths.length < 2) {
        callback('Please use two paths');
        return
    }
    Promise.all([readFileLines(paths[0]), readFileLines(paths[1])]).then(([fileOne, fileTwo]) => {
        console.log('Both maps', fileTwo, fileOne);
        diffFiles(fileTwo, fileOne);
    })
}


function runChildProcess(data, callback) {
    const [command, ...args] = data;
    const myChildProcess = spawn(command, [...args]);
    myChildProcess.stdout.on('data', (data) => callback(data));
    myChildProcess.stderr.on('data', (data) => callback(data));
    myChildProcess.on('exit', (code, data) => {
        if (code !== 1) {
            console.log('Exit code', code);
            console.log('Msg', data);
        }
    });
}

function readBigFileStream(args, currentDir, callback) {
    if (!args[0] || typeof args[0] !== 'string' || !fs.existsSync(path.join(currentDir, args[0].toString()))) {
        callback('Enter a valid path')
        return
    }
    const limit = 100;
    const file = fs.createReadStream(args[0]);
    let counter = 0;
    file.on('data', (data) => {
        if (counter < limit) {
            callback(data);
            counter += data.toString().length
        } else {
            callback('Limit reached')
            file.close();
        }
    })
}

const commandsMap = {
    ls: {},
    pwd: {},
    clear: {},
    cd: {},
    diff: {},
    useBash: {},
    readBigFile: {},
}

module.exports = {
    commandsMap,
    ls,
    cd,
    diff,
    useBashStream: runChildProcess,
    readBigFileStream,
}