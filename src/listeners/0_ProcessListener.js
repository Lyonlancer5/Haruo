// Core listener
// Cannot be removed
const unmetPromises = new Map();

function load(bot) {
    process.on("beforeExit", (exitCode) => {
        Logv.info(`Exiting with error code ${exitCode}`);

        // Cleanup efforts
        bot.disconnect({ reconnect: false });
        if (unmetPromises.size > 0)
            // :aThinkpitz:
            Logv.misc(`Unmet promises while closing: ${unmetPromises.size}`);
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
