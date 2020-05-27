class Logger {
    static timestamp() {
        let f = new Date(Date.now());
        let hr = f.getHours() < 10 ? `0${f.getHours()}` : `${f.getHours()}`;
        let min = f.getMinutes() < 10 ? `0${f.getMinutes()}` : `${f.getMinutes()}`;
        let sec = f.getSeconds() < 10 ? `0${f.getSeconds()}` : `${f.getSeconds()}`;

        return `[${hr}:${min}:${sec}]`;
    }

    static log(header, msg) {
        msg = msg.toString();

        msg.split(/\r?\n/g).forEach(t => console.log(`${this.timestamp()} ${header} ${t}\x1b[0m`));
    }

    static misc(msg) {
        this.log('\x1b[34;49m[MISC]: ', msg);
    }

    static info(msg) {
        this.log('\x1b[32;49m[INFO]: ', msg);
    }

    static warn(msg, err) {
        this.log('\x1b[33;49m[WARN]: ', `${msg}${err ? `\n${err}` : ''}`);
    }

    static error(msg, err) {
        this.log('\x1b[31;49m[ERROR]: ', `${msg}${err ? `\n${err}` : ''}`);
    }

    static fatal(msg, err) {
        this.log('\x1b[5;37;41m[FATAL]\x1b[25;31;49m: ', `${msg}${err ? `\n${err}` : ''}`);
    }
}

module.exports = Logger;
