const ava = require('ava');
const { fs, tempFile, tempFileLoc, tempDirLoc } = require('./lib');
const nextra = require('../src');

ava('Pre-Existing', async test => {
	test.plan(2);

	const file = tempFile();
	const retVal = await nextra.outputFileAtomic(file, 'pass');

	test.is(retVal, undefined);
	test.is(await fs.readFileAsync(file, 'utf8'), 'pass');
});

ava('New', async test => {
	test.plan(2);

	const file = tempFileLoc();
	const retVal = await nextra.outputFileAtomic(file, 'pass');

	test.is(retVal, undefined);
	test.is(await fs.readFileAsync(file, 'utf8'), 'pass');
});

ava('New Recursive', async test => {
	test.plan(2);

	const deepDir = tempDirLoc(tempFileLoc());
	const retVal = await nextra.outputFileAtomic(deepDir, 'pass');

	test.is(retVal, undefined);
	test.is(await fs.readFileAsync(deepDir, 'utf8'), 'pass');
});