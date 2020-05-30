// Core listener
// Cannot be removed
const Logger = require("./../lib/Logger");

const unmetPromises = new Map();

function load(bot) {
    process.on("beforeExit", (exitCode) => {
        Logger.info(`Exiting with error code ${exitCode}`);

        // Cleanup efforts
        bot.disconnect({ reconnect: false });
        if (unmetPromises.size > 0)
            // :aThinkpitz:
            Logger.misc(`Unmet promises while closing: ${unmetPromises.size}`);
    });

    process.on("unhandledRejection", (reason, promise) => {
        unmetPromises.set(promise, reason);
    });

    process.on("rejectionHandled", (promise) => {
        unmetPromises.delete(promise);
    });
}

function unload() {}

module.exports = { load, unload };
