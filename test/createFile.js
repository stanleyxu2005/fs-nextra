const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('New File (Standard Usage)', async test => {
	test.plan(2);

	const file = tempFileLoc();
	const retVal = await nextra.createFile(file);
	const stats = await fs.statAsync(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('Pre-Existing File', async test => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.createFile(file);
	const stats = await fs.statAsync(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('New File w/ Non-Existent Directories', async test => {
	test.plan(2);

	const file = tempDirLoc(tempFileLoc());
	const retVal = await nextra.createFile(file);
	const stats = await fs.statAsync(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});

ava('New File (Atomic Shortcut)', async test => {
	test.plan(2);

	const file = tempFileLoc();
	const retVal = await nextra.createFile(file, true);
	const stats = await fs.statAsync(file);

	test.is(retVal, undefined);
	test.true(stats.isFile());
});