/**
 * @file Version stuff
 * @author Lyonlancer5
 */
const { existsSync, readFileSync } = require("fs");
const { resolve } = require("path");

const { projectDir } = require("./Directories");

/**
 * @type {String}
 */
let commitStr;

/**
 * @type {String}
 */
let versionStr;

/**
 * Gets the current git hash, assuming git's presence.
 *
 * @param {Boolean} truncate Whether to truncate the hash to 7 characters (default: false)
 * @returns {String} The git hash, or an empty String if not pulled from git
 */
function getGitHash(truncate = false) {
    if (!commitStr) {
        const gitHead = resolve(projectDir, ".git/", "HEAD");
        if (!existsSync(gitHead)) commitStr = "";
        else {
            const ref = resolve(
                projectDir,
                ".git/",
                readFileSync(gitHead).toString().slice(5).replace("\n", "")
            );
            if (existsSync(ref))
                commitStr = readFileSync(ref).toString().replace("\n", "");
            else commitStr = "";
        }
    }

    return truncate ? commitStr.substring(0, 7) : commitStr;
}

/**
 * Get version string
 *
 * @returns {String} The version as specified in `package.json`, or 'UNKNOWN' if it 404'd
 */
function getVersion() {
    if (!versionStr)
        try {
            const { version } = JSON.parse(
                readFileSync(resolve(projectDir, "package.json"))
            );
            versionStr = version;
        } catch (_) {
            versionStr = "UNKNOWN";
        }

    return versionStr;
}

/**
 *@returns {String} Formatted version string
 */
function getFormattedVersion() {
    return `Haruo ${getVersion()} [git-${getGitHash(true)}]`;
}

module.exports = { getGitHash, getVersion, getFormattedVersion };
