/**
 * @file main()
 */

// process launch arguments
const offlineMode = process.argv.includes("--test-offline");

// Import dependencies
const fs = require("fs").promises;

const HaruoConf = require("./lib/Configuration");
const DeltaField = require("./lib/DeltaField");
const Haruo = require("./lib/Haruo");
const Logger = require("./lib/Logger");
const { filterNonJS } = require("./lib/Toolbox");

// Bot setup
const config = HaruoConf.get();
const bot = new Haruo(config);
fs.readdir(`${__dirname}/events`, { withFileTypes: true })
    // Load event handlers
    .then(
        (files) =>
            filterNonJS(files).forEach((jsFile) =>
                require(`${__dirname}/events/${jsFile.name}`)(bot)
            ),
        (err) => Logger.error("Event handlers loading failed", err)
    )
    // Load modules
    .then(() =>
        DeltaField.getModules(true).then((modules) =>
            modules.forEach((mod) => DeltaField.loadModule(mod, bot))
        )
    )
    // Load bot core
    .then(() => {
        if (!offlineMode)
            bot.connect().catch((err) => {
                Logger.error("Failed to initialize", err);
                process.exit(1);
            });
        else Logger.info("Offline mode, not connecting to Discord.");
    });
