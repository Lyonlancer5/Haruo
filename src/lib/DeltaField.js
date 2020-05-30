const fs = require("fs");
const path = require("path");

const Logger = require("./Logger");

const lstDir = path.resolve(__dirname, "../", "listeners");
const listeners = new Map();

/**
 * Delta Field | Self-updating and self-reloading
 *
 * {Signatures: final-class, no-public-constructor}
 *
 * - Handles non-core modules (such as commands, event listeners and misc stuff)
 * - Reloads non-core modules when the source has been modified (via FSWatcher)
 */
class DeltaField {
    /**
     *
     * @param {Haruo} bot The bot instance
     */
    static loadListeners(bot) {
        fs.readdir(lstDir, (err, files) => {
            if (err) {
                Logger.error("Event listeners could not be located.");
                console.error(err);
                return;
            }

            files
                .filter(
                    (v) =>
                        // Part 1, enforce "[0-9]_" prefix
                        v.search(/\d{1}_/g) !== -1 &&
                        // Part 2, kekw on the file extension because we madlads
                        v.search(/\.(J|j)(S|s)/g) !== -1
                )
                .sort()
                .forEach((mod) => {
                    try {
                        const lmod = require(path.resolve(lstDir, mod));
                        if (!listeners.get(mod)) {
                            lmod.load(bot); // assumes that the function exists, which *should*
                            listeners.set(mod, lmod);
                            Logger.misc(`Loaded event listener: ${mod}`);
                        }
                    } catch (e2) {
                        Logger.error(`Failed to load event listener: ${mod}`);
                        console.error(e2);
                    }
                });
        });
    }
}

module.exports = DeltaField;
