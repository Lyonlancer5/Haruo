/**
 * @file main()
 */

// Import dependencies
const Haruo = require('./lib/Haruo');
const HaruoConf = require('./lib/HaruoConf');
const Logger = require('./lib/Logger');

const config = HaruoConf.get();

// Globals/overrides
global.Promise = require('bluebird');

// Bot setup
const bot = new Haruo(config);

// register listeners
// TODO just making a sample for now
bot.on('ready', async () => {
    Logger.info(`${bot.toString()} | Online`);
    bot.editStatus('online', {name: 'Haruo Indev', type: 0});
});

// register commands
// TODO

bot.connect().catch(err => {
    Logger.error('Failed to initialize Haruo');
    console.error(err);
    process.exit(1);
});
