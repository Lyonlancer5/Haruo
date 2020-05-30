/**
 * @file main()
 */

// Import dependencies
const DeltaField = require("./lib/DeltaField");
const Haruo = require("./lib/Haruo");
const HaruoConf = require("./lib/HaruoConf");

const config = HaruoConf.get();

// Globals/overrides
global.Promise = require("bluebird");

// Bot setup
const bot = new Haruo(config);

// Init and register everything
DeltaField.loadListeners(bot);
