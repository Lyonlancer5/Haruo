const fs = require("fs");
const path = require("path");

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
                Logv.error("Event listeners could not be located.");
                console.error(err);
                return;
            }

            files
                .filter((v) => v.search(/\d{1}_/g) !== -1 && v.endsWith(".js"))
                .sort()
                .forEach((mod) => {
                    try {
                        const lmod = require(path.resolve(lstDir, mod));
                        if (!listeners.get(mod)) {
                            lmod.load(bot); // assumes that the function exists, which *should*
                            listeners.set(mod, lmod);
                            Logv.misc(`Loaded event listener: ${mod}`);
                        }
                    } catch (e2) {
                        Logv.error(`Failed to load event listener: ${mod}`);
                        console.error(e2);
                    }
                });
        });
    }
}

module.exports = DeltaField;
