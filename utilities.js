const fs = require('fs');
function getCommandArgs(data) {
    let instruction, args;
    [instruction, ...args] = data.split(" ");
    return { instruction, args }
}

function welcomeMsg() {
    return `\n\tWelcome to node cli linux.
    These are the commands you can use\n
    \t-ls
    \t-cd
    \t-pwd
    \t-diff
    \t-clear
    \t-runInShell
    \t-readBigFile
    \tFor help use -h
    `
}

let readFileLines = (filePath) => {
    const lineMap = {};
    return new Promise((res, rej) => {
        fs.readFile(filePath, (err, fileData) => {
            if (err) rej(null)
            fileData.toString().split("\n").forEach((line, index) => {
                lineMap[line] = index;
            });
            res(lineMap);
        })
    })
}

function diffFiles(fileOne, fileTwo) {
    const emptyLineCheck = (key) => `${key === '' ? 'Empty line' : key}`;
    let linePosition = 0;
    for (let key in fileOne) {
        linePosition = fileTwo[key] - fileOne[key];
        if (!isNaN(linePosition)) {
            if (linePosition > 0) {
                console.log(`Move '${emptyLineCheck(key)}' ${linePosition} lines down`);
            }
            if (linePosition < 0) {
                console.log(`Move '${emptyLineCheck(key)}' ${linePosition * -1} lines up`);
            }
        } else {
            if (!fileTwo[key]) {
                console.log(`Erase '${emptyLineCheck(key)}' at line ${fileOne[key]}`);
            }
        }
        delete fileTwo[key];
    }
    for (let key in fileTwo) {
        console.log(`Insert '${emptyLineCheck(key)}' at line ${fileTwo[key]}`);
    }
}

module.exports = {
    getCommandArgs,
    welcomeMsg,
    diffFiles,
    readFileLines
}
