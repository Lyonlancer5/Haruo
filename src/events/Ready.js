const Logger = require("../lib/Logger");

module.exports = (bot) => {
    bot.on("ready", () => {
        Logger.info(`${bot.toString()} | Online`);
        bot.editStatus("online", { name: "Haruo Indev", type: 0 });
    });
};
