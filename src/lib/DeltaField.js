const fs = require("fs").promises;
const path = require("path");

const Logger = require("./Logger");
const { filterNonJS } = require("./Toolbox");

const modulesDir = path.resolve(__dirname, "../", "modules/");

/**
 * List of enumerated modules.
 * @type String[]
 */
const foundModules = [];

/**
 * Mod paths <filename::String, path::String>
 * @type Map<String, String>
 */
const modulePaths = new Map();

/**
 * Mod instances <name::String, instance::Object>
 * @type Map<String, Object>
 */
const loadedModules = new Map();

// Private functions

/**
 * Does the actual module loading.
 * Automatically sets the `unloaded` flag for a module if crashed.
 *
 * @param {String} dir Module parent directory
 * @param {String} name Module name
 * @param {Map<String, Object>} group Module group
 * @param {Object} bot Bot instance
 * @param {Boolean} ignoreForcedUnload Whether or not to ignore `forcedUnload` flag (set if load errored/by __modUnload())
 *
 * @returns {Boolean} True if module has loaded, false otherwise
 */
function __modLoad(dir, name, group, bot, ignoreForcedUnload = false) {
    // Sanity checks
    if (!dir) throw new TypeError("Module directory cannot be undefined");
    if (!name) throw new TypeError("Module file name cannot be undefined");
    if (!group) throw new TypeError("Module group cannot be undefined");
    if (!bot) throw new TypeError("Bot instance cannot be undefined");
    if (ignoreForcedUnload) Logger.info("TODO Flag currently unused");

    const modPath = path.resolve(dir, name);
    if (!group.get(name)) {
        const modInstance = require(modPath); // Failure point

        if (typeof modInstance.load !== "function") {
            Logger.error(`Module '${name}' has no load function, skipping`);
            return false;
        }

        modInstance.load(bot); // Another failure point
        modulePaths.set(name, modPath);
        group.set(name, modInstance);
    }
    // Default to true if loaded
    return true;
}

/**
 * Does the actual module unloading.
 *
 * @param {String} name Module name
 * @param {Map<String, Object>} group Module group
 * @param {Object} bot Bot instance
 * @param {Boolean} setForcedUnload Whether or not to set the `unloaded` flag
 *
 */
function __modUnload(name, group, bot, setForcedUnload = false) {
    if (!name) throw new TypeError("Module file name cannot be undefined");
    if (!group) throw new TypeError("Module group cannot be undefined");
    if (!bot) throw new TypeError("Bot instance cannot be undefined");

    const modInstance = group.get(name);
    if (modInstance) {
        if (typeof modInstance.unload === "function") modInstance.unload();
        group.delete(name);
        delete require.cache[modulePaths.get(name)];
        modulePaths.delete(name);
        if (setForcedUnload) Logger.info("TODO Flag currently unused");
    }
}

/**
 * Delta Field | Self-updating and self-reloading modules
 *
 * {Signatures: final-class, no-public-constructor}
 *
 */
class DeltaField {
    /**
     * Loads a module with the specified filename.
     *
     * @param {String} name Module name
     * @param {Object} bot Bot instance
     */
    static loadModule(name, bot) {
        try {
            if (__modLoad(modulesDir, name, loadedModules, bot))
                Logger.misc(`Loaded module: ${name}`);
        } catch (err) {
            Logger.error(`Failed to load module: ${name}`, err);
        }
    }

    /**
     * Unloads a module with the specified filename.
     *
     * @param {String} name Module name
     * @param {Object} bot Bot instance
     */
    static unloadModule(name, bot) {
        try {
            __modUnload(name, loadedModules, bot);
            Logger.misc(`Unloaded module: ${name}`);
        } catch (err) {
            Logger.error(`Failed to unload module: ${name}`, err);
        }
    }

    /**
     * Reloads (re-reads from disk) a module with the specified filename.
     *
     * @param {String} name Module name
     * @param {Object} bot Bot instance
     */
    static reloadModule(name, bot) {
        try {
            __modUnload(name, loadedModules, bot);
            // Re-read from disk
            __modLoad(modulesDir, name, loadedModules, bot);
            Logger.misc(`Reloaded module: ${name}`);
        } catch (err) {
            Logger.error(`Failed to reload module: ${name}`, err);
        }
    }

    /**
     * Gets the list of found modules.
     * @param {Boolean} forceRefresh To force a rediscovery of modules from disk
     */
    static async getModules(forceRefresh = false) {
        if (forceRefresh)
            await fs
                .readdir(modulesDir, { withFileTypes: true })
                .then((dirs) => {
                    foundModules.length = 0; // Array.clear(): ???
                    filterNonJS(dirs).forEach((dir) =>
                        foundModules.push(dir.name)
                    );
                    Logger.info(
                        `Modules: found ${foundModules.length} modules`
                    );
                    return foundModules;
                });
        return foundModules;
    }
}

module.exports = DeltaField;
