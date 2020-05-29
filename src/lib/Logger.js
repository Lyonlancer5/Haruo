class Logger {
    static timestamp() {
        const f = new Date(Date.now());
        const hr = f.getHours() < 10 ? `0${f.getHours()}` : `${f.getHours()}`;
        const min =
            f.getMinutes() < 10 ? `0${f.getMinutes()}` : `${f.getMinutes()}`;
        const sec =
            f.getSeconds() < 10 ? `0${f.getSeconds()}` : `${f.getSeconds()}`;

        return `[${hr}:${min}:${sec}]`;
    }

    static log(header, msg) {
        msg.split(/\r?\n/g).forEach((t) =>
            console.log(`${this.timestamp()} ${header} ${t}\x1b[0m`)
        );
    }

    static misc(msg) {
        this.log("\x1b[34;49m[MISC]: ", msg);
    }

    static info(msg) {
        this.log("\x1b[32;49m[INFO]: ", msg);
    }

    static warn(msg, err) {
        this.log("\x1b[33;49m[WARN]: ", `${msg}${err ? `\n${err}` : ""}`);
    }

    static error(msg, err) {
        this.log("\x1b[31;49m[ERROR]: ", `${msg}${err ? `\n${err}` : ""}`);
    }

    static fatal(msg, err) {
        this.log(
            "\x1b[5;37;41m[FATAL]\x1b[25;31;49m: ",
            `${msg}${err ? `\n${err}` : ""}`
        );
    }
}

module.exports = Logger;
