/**
 * @file Toolbox for miscellaneous functions.
 */

/**
 * Filters non-JS files out of the directory entries array.
 *
 * Not necessarily fool-proof because file extensions only matter in Windows :p
 *
 * @param {Array<Dirent>} direntArray The array of directory entries.
 * @returns {Array<Dirent>} Filtered and sorted dirent array
 */
function filterNonJS(direntArray) {
    if (!Array.isArray(direntArray))
        throw new TypeError("direntArray not specified");

    return direntArray
        .filter((v) => v.isFile() && v.name.search(/\.(J|j)(S|s)/g) !== -1)
        .sort((a, b) => a.name.localeCompare(b.name));
}

module.exports = { filterNonJS };
