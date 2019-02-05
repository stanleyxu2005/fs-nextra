const ava = require('ava');
const { fs, tempFile, tempFileLoc } = require('./lib');
const nextra = require('../src');

ava('Standard Usage', async test => {
	test.plan(2);

	const file = tempFileLoc();
	const obj = { test: 'passed' };
	const retVal = await nextra.writeJSONAtomic(file, obj);

	test.is(retVal, undefined);
	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});

ava('Existing', async test => {
	test.plan(2);

	const file = tempFile();
	const obj = { test: 'passed' };
	const retVal = await nextra.writeJSONAtomic(file, obj);

	test.is(retVal, undefined);
	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});