// Not actually a listener
// Just a loader

let inited;

function load(bot) {
    if (!inited) {
        bot.connect().catch((err) => {
            Logv.error("Failed to initialize");
            console.error(err);
            process.exit(1);
        });
        inited = 1;
    }
}

function unload() {}

module.exports = { load, unload };
