const { dirname } = require('path');

const { writeFile } = require('../fs');

const writeFileAtomic = require('./writeFileAtomic');
const mkdirs = require('./mkdirs');
const pathExists = require('./pathExists');

/**
 * Creates an empty file, making all folders required to satisfy the given file path.
 * @function ensureFile
 * @memberof fsn/nextra
 * @param {string} file Path of the file you want to create
 * @param {boolean} [atomic = false] Whether the operation should run atomically
 * @returns {Promise<void>}
 */
/**
 * Creates an empty file, making all folders required to satisfy the given file path.
 * @function createFile
 * @memberof fsn/nextra
 * @param {string} file Path of the file you want to create
 * @param {boolean} [atomic = false] Whether the operation should run atomically
 * @returns {Promise<void>}
 */
module.exports = async function createFile(file, atomic = false) {
	if (await pathExists(file)) return;

	await mkdirs(dirname(file));

	const writeMethod = atomic ? writeFileAtomic : writeFile;
	await writeMethod(file, '');
};