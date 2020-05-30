const fs = require("fs").promises;
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
        fs.readdir(lstDir, { withFileTypes: true }).then(
            (files) => {
                files
                    .filter(
                        (v) =>
                            // Part 1, check if its actually a file
                            v.isFile() &&
                            // Part 2, enforce "[0-9]_" prefix
                            v.name.search(/\d{1}_/g) !== -1 &&
                            // Part 3, kekw on the file extension because we madlads
                            v.name.search(/\.(J|j)(S|s)/g) !== -1
                    )
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .forEach((mod) => {
                        try {
                            const nmod = mod.name;
                            const lmod = require(path.resolve(lstDir, nmod));
                            if (!listeners.get(nmod)) {
                                lmod.load(bot);
                                listeners.set(nmod, lmod);
                                Logger.misc(`Loaded event listener: ${nmod}`);
                            }
                        } catch (err) {
                            Logger.error(
                                `Failed to load event listener: ${mod.name}`
                            );
                            console.err(err);
                        }
                    });
            },

            (err) => {
                Logger.error("Could not load event listeners");
                console.err(err);
            }
        );
    }
}

module.exports = DeltaField;
