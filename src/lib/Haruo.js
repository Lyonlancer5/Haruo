const Eris = require("eris");

const { getFormattedVersion } = require("./Version");

/**
 * Extension of Eris.Client
 *
 * @prop {HaruoConf} config The main configuration
 */
class Haruo extends Eris.Client {
    constructor(config) {
        super(config.general.token, config.eris);
        this.config = config;
    }

    /**
     * Validates configuration then connects
     * @returns {Promise<Void>} [super.connect()]: Resolves when all shards are initialized
     */
    async connect() {
        this.config.validate();
        await super.connect();
    }

    getUptimeFormatted() {
        let time = this.uptime / 1000;

        let seconds = Math.floor(time % 60);
        if (seconds < 10) seconds = `0${seconds}`;
        time /= 60;

        let minutes = Math.floor(time % 60);
        if (minutes < 10) minutes = `0${minutes}`;
        time /= 60;

        let hours = Math.floor(time % 24);
        if (hours < 10) hours = `0${hours}`;
        time /= 24;

        return `${Math.floor(time)} days, ${hours}:${minutes}:${seconds}`;
    }

    toString() {
        return `${getFormattedVersion()} | Uptime: ${this.getUptimeFormatted()}`;
    }
}

module.exports = Haruo;
