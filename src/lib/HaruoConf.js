/**
 * @file Configuration processor for Haruo
 */

const {configDir} = require('./Directories');
const {existsSync} = require('fs');
const {resolve} = require('path');
const YAML = require('yamljs');
const Logger = require('./Logger');

/**
 * Haruo configuration
 *
 * @prop {Object} general Main configuration
 *
 * @prop {Object} development Stuff and things
 *
 * @prop {Object} datastore Data storage configuration
 *
 * @prop {Object} discord Discord activity presence
 *
 * @prop {Object} treediagram Logging but on channels
 *
 * @prop {Object} eris Eris configuration
 * @see https://abal.moe/Eris/docs/Client
 */
class HaruoConf {
    /**
     * Wraps the original configuration object.
     *
     * @param {Object} config The original configuration object
     */
    constructor(config) {
        this.general = config.general;
        this.development = config.development;
        this.datastore = config.datastore;
        this.discord = config.discord;
        this.treediagram = config.treediagram;
        this.eris = config.eris;
    }

    /**
     * Validates required configuration values.
     */
    validate() {
        let general = this.general;

        // Validate general config values
        if (!general.token) throw TypeError('Configuration: Bot token not specified');
        if (!general.ownerID) throw TypeError('Configuration: Owner ID not specified');
        if (!general.prefix) throw TypeError('Configuration: Primary prefix not specified');
    }

    /**
     * Configuration parser.
     * If called without parameters, uses [process.env] as the configuration.
     *
     * @param {String} file Path to configuration, may be absolute, relative or null.
     * @returns {HaruoConf} Configuration
     * @see process.env
     */
    static get(file = resolve(configDir, 'main-config.yml')) {
        let hconf;
        if (file && existsSync(file)) {
            try {
                hconf = YAML.load(file);
            } catch(err) {
                Logger.warn('Configuration error', err);
            }
            Logger.misc(`Configuration loaded from ${file}`);
        } else {
            Logger.warn('Configuration missing');
        }

        try {
            hconf.eris = YAML.load(resolve(configDir, 'eris-config.yml'));
        } catch(e) {
            Logger.warn('Internal eris configuration missing, this may cause problems.');
        }
        return new HaruoConf(hconf);
    }
}

module.exports = HaruoConf;
