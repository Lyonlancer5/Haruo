// Not actually a listener
// Just a loader

const Logger = require("./../lib/Logger");

let inited;

function load(bot) {
    if (!inited) {
        bot.connect().catch((err) => {
            Logger.error("Failed to initialize");
            console.error(err);
            process.exit(1);
        });
        inited = 1;
    }
}

function unload() {}

module.exports = { load, unload };
