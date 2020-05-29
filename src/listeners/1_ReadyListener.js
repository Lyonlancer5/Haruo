function onReady(bot) {
    Logv.info(`${bot.toString()} | Online`);
    bot.editStatus("online", { name: "Haruo Indev", type: 0 });
}

function load(bot) {
    bot.on("ready", () => onReady(bot));
}

function unload(bot) {
    bot.removeListener("ready", onReady);
}

module.exports = { load, unload };
