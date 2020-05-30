/**
 * @file Configuration processor for Haruo
 */

const dotenv = require("dotenv");
const YAML = require("yamljs");

const { existsSync } = require("fs");
const { resolve } = require("path");

const { configDir } = require("./Directories");
const Logger = require("./Logger");

/**
 * [Internal] Formats the key string to the key used in the JS object.
 *
 * @param {String} str Key string
 * @param {Number} len Header length
 * @returns {String} Properly-formatted key
 */
function formatKey(str, len) {
    let res = str.slice(len).toLowerCase();
    ["id", "url"].forEach(
        (val) => (res = res.replace(val, (s) => s.toUpperCase()))
    );
    return res.replace(/_./g, (m, i, s) =>
        /[A-Z]/.test(s[i - 1]) ? m[1] : m[1].toUpperCase()
    );
}

/**
 * [Internal] Used to turn env configuration key-value pairs to JS objects.
 *
 * @param {[String, String]} env Object.entries(process.env)
 * @param {String} header Header to check for
 * @returns {Object} A JS object containing the key-value pairs as sub-objects
 */
function convert(env, header) {
    const retval = env
        .filter((val) => val[0].startsWith(header))
        .map(([key, val]) => ({ [formatKey(key, header.length)]: val }));
    return retval.reduce((k, v) => Object.assign(k, v), {});
}

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
        const { general } = this;

        // Validate general config values
        if (!general.token)
            throw new TypeError("Configuration: Bot token not specified");
        if (!general.ownerID)
            throw new TypeError("Configuration: Owner ID not specified");
        if (!general.prefix)
            throw new TypeError("Configuration: Primary prefix not specified");
    }

    /**
     * Configuration parser.
     * If called without parameters, uses [process.env] as the configuration.
     *
     * @param {String} file Path to configuration.
     * @returns {HaruoConf} Configuration
     * @see process.env
     */
    static get(file = resolve(configDir, "main-config.yml")) {
        let hconf;
        if (file && existsSync(file)) {
            try {
                hconf = YAML.load(file);
            } catch (err) {
                Logger.warn("Configuration error", err);
            }
            Logger.misc(`Configuration loaded from ${file}`);
        } else {
            const dtcf = dotenv.config();
            if (dtcf.error) {
                Logger.warn("Failed to load configuration from .env");
                throw dtcf.error;
            }

            const env = Object.entries(process.env);
            hconf = {
                general: convert(env, "HARUO_GENERAL_"),
            };
            Logger.misc("Configuration loaded from .env");
        }

        try {
            hconf.eris = YAML.load(resolve(configDir, "eris-config.yml"));
        } catch (e) {
            Logger.warn(
                "Base eris configuration missing, this may cause problems."
            );
        }
        return new HaruoConf(hconf);
    }
}

module.exports = HaruoConf;
