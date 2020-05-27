const Eris = require('eris');
const {getFormattedVersion} = require(`./Version`);

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
        let seconds = time % 60;
        time /= 60;
        let minutes = time % 60;
        time /= 60;
        let hours = time % 24;
        time /= 24;

        return `${Math.floor(time)} days, ${Math.floor(hours)}:${Math.floor(minutes)}:${Math.floor(seconds)}`;
    }

    toString() {
        return `${getFormattedVersion()} | Uptime: ${this.getUptimeFormatted()}`;
    }
}

module.exports = Haruo;
