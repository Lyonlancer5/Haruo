/**
 * @file Version stuff
 * @author Lyonlancer5
 */
const {existsSync, readFileSync} = require('fs');
const {resolve} = require('path');
const {projectDir} = require('./Directories');

/**
 * @type {String}
 */
let commit;

/**
 * @type {String}
 */
let version;

/**
 * Gets the current git hash, assuming git's presence.
 *
 * @param {Boolean} truncate Whether to truncate the hash to 7 characters (default: false)
 * @returns {String} The git hash, or an empty String if not pulled from git
 */
function getGitHash(truncate = false) {
    if (!commit) {
        let git_head = resolve(projectDir, '.git/', 'HEAD');
        if (!existsSync(git_head))
            commit = '';
        else {
            let ref = resolve(projectDir, '.git/', readFileSync(git_head).toString().slice(5).replace('\n', ''));
            if (existsSync(ref))
                commit = readFileSync(ref).toString().replace('\n', '');
            else
                commit = '';
        }
    }

    return truncate ? commit.substring(0, 7) : commit;
}

/**
 * Get version string
 *
 * @returns {String} The version as specified in `package.json`, or 'UNKNOWN' if it 404'd
 */
function getVersion() {
    if (!version) {
        try {
            version = JSON.parse(readFileSync(resolve(projectDir, 'package.json'))).version;
        } catch(_) {
            version = 'UNKNOWN';
        }
    }

    return version;
}

/**
 *@returns {String} Formatted version string
 */
function getFormattedVersion() {
    return `Haruo ${getVersion()} [git-${getGitHash(true)}]`;
}

module.exports = {getGitHash, getVersion, getFormattedVersion};
