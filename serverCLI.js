const EventEmitter = require('events');
const { ls, diff, cd, useBashStream, readBigFileStream, commandsMap } = require('./instructions');
const { welcomeMsg } = require('./utilities');

class CLI extends EventEmitter {
    constructor(user) {
        super();
        setImmediate(() => this.emit('response', welcomeMsg()));
        this.currentDIR = { path: __dirname };
        this.user = user;
        this.user.on('command', ({ instruction, args }) => {
            if (commandsMap[instruction]) {
                this[instruction](args);
            } else {
                this.emit('response', `Command: ${instruction} not recognized`);
            }
        });

    }

    ls() {
        this.emit('response', ls(this.currentDIR.path));
    }

    pwd() {
        this.emit('response', this.currentDIR.path);
    }

    diff(args) {
        diff(args, this.currentDIR.path, (data) => {
            this.emit('response', data.toString());
        });
    }

    cd(args) {
        this.currentDIR.path = cd(args, this.currentDIR.path);
        this.emit('response', `now in ${this.currentDIR.path}`);
    }

    clear() {
        this.emit('clear');
    }

    useBash(args) {
        useBashStream(args, (data) => {
            this.emit('response', data.toString());
        })
    }

    readBigFile(args) {
        readBigFileStream(args, this.currentDIR.path, (data) => {
            this.emit('response', data.toString());
        });
    }
}

module.exports = {
    linux: (client) => new CLI(client),
}