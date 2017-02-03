"use strict";

const path = require('path');
const fs   = require('fs');

/* a note on the un-cached fs.readFileSync:
 *   I've done some tests with caching the function (with _.memoize), however
 *   _with_ and _without_ cache didn't make a difference, performance-wise.
 *   This is probably because the OS already does some clever caching of its own.
 *
 *   Test config:
 *   - OSX 10.11.6
 *   - MacBook Pro (15-inch, 2.53GHz, Mid 2009)
 *   - Memory: 4 Gb 1067 MHz DDR3
 *   - Disk: 256Gb SATA with a HFS+ journaled file system (a spinning disk to be sure)
 *   - ~400 javascript, typescript and coffeescript modules
 */

module.exports =
    (pBaseDir) => {
        let lRetval = null;

        try {
            lRetval = JSON.parse(
                fs.readFileSync(`${pBaseDir}${path.sep}package.json`, 'utf8')
            );
        } catch (e) {
            // left empty on purpose
        }
        return lRetval;
    };
