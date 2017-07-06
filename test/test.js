const ava = require('ava');
const { resolve } = require('path');
const tsubaki = require('tsubaki');
const mock = require('mock-fs');
const fs = tsubaki.promisifyAll(require('fs'));
const nextra = require('../src/index');

const dir = resolve(__dirname, 'test');
const files = {
	copy: resolve(dir, 'copy.txt'),
	ensureDir: resolve(dir, 'ensureDir'),
	createFile: resolve(dir, 'createFile'),
	createSymlink: {
		src: resolve(dir, 'createSymlinkSrc'),
		dest: resolve(dir, 'createSymlinkDest')
	},
	createlink: {
		src: resolve(dir, 'createlinkSrc.txt'),
		dest: resolve(dir, 'createlinkDest.txt')
	},
	emptyDir: {
		empty: resolve(dir, 'empty'),
		full: resolve(dir, 'full')
	},
	readJSON: resolve(dir, 'readJSON.json'),
	pathExists: {
		dir: resolve(dir, 'path'),
		file: resolve(dir, 'path.txt')
	}
};

ava.before(test => {
	mock({
		[files.copy]: '',
		[files.ensureDir]: {},
		[files.createFile]: '',
		[files.createSymlink.src]: mock.symlink({ path: files.createSymlink.dest }),
		[files.createlink.src]: 'linked',
		[files.createlink.dest]: 'linked',
		[files.emptyDir.empty]: {},
		[files.emptyDir.full]: { 'file.txt': '' },
		[files.readJSON]: '{ "validate": true }',
		[files.pathExists.dir]: {},
		[files.pathExists.file]: ''
	});
	test.pass();
});

ava.after.always(test => {
	mock.restore();
	test.pass();
});

// Copy

ava('copy', async test => {
	const copy = resolve(dir, 'copied');
	await nextra.copy(files.copy, copy);

	const stats = await fs.statAsync(copy);
	test.true(stats.isFile());
});

// createFile

ava('createFile (pre-existing)', async test => {
	await nextra.createFile(files.createFile);

	const stats = await fs.statAsync(files.createFile);
	test.true(stats.isFile());
});

ava('createFile (new)', async test => {
	const file = resolve(dir, 'createFileNew');
	await nextra.createFile(file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava('createFile (new recursive)', async test => {
	const file = resolve(dir, 'createFileNew2', 'createFileNew3');
	await nextra.createFile(file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

// createFileAtomic

ava('createFileAtomic (pre-existing)', async test => {
	await nextra.createFileAtomic(files.createFile);

	const stats = await fs.statAsync(files.createFile);
	test.true(stats.isFile());
});

ava('createFileAtomic (new)', async test => {
	const file = resolve(dir, 'createFileNew');
	await nextra.createFileAtomic(file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

ava('createFileAtomic (new recursive)', async test => {
	const file = resolve(dir, 'createFileNew2', 'createFileNew3');
	await nextra.createFileAtomic(file);

	const stats = await fs.statAsync(file);
	test.true(stats.isFile());
});

// createLink

ava('createLink (pre-existing)', async test => {
	await nextra.createLink(files.createlink.src, files.createlink.dest);

	const stats = await fs.statAsync(files.createlink.dest);
	test.true(stats.isFile());
});

ava('createLink (new)', async test => {
	const newDir = resolve(dir, 'createLinkNew.txt');
	await nextra.createLink(files.createlink.src, newDir);

	const stats = await fs.statAsync(newDir);
	test.true(stats.isFile());
});

ava('createLink (new recursive)', async test => {
	const deepDir = resolve(dir, 'createLinkNew2', 'createLinkNew3.txt');
	await nextra.createLink(files.createlink.src, deepDir);

	const stats = await fs.statAsync(deepDir);
	test.true(stats.isFile());
});

// createLinkAtomic

ava('createLinkAtomic (pre-existing)', async test => {
	await nextra.createLinkAtomic(files.createlink.src, files.createlink.dest);

	const stats = await fs.statAsync(files.createlink.dest);
	test.true(stats.isFile());
});

ava('createLinkAtomic (new)', async test => {
	const newDir = resolve(dir, 'createLinkNew.txt');
	await nextra.createLinkAtomic(files.createlink.src, newDir);

	const stats = await fs.statAsync(newDir);
	test.true(stats.isFile());
});

ava('createLinkAtomic (new recursive)', async test => {
	const deepDir = resolve(dir, 'createLinkNew2', 'createLinkNew3.txt');
	await nextra.createLinkAtomic(files.createlink.src, deepDir);

	const stats = await fs.statAsync(deepDir);
	test.true(stats.isFile());
});

// createSymlink

ava('createSymlink (pre-existing)', async test => {
	await nextra.createSymlink(files.createSymlink.src, files.createSymlink.dest);

	const stats = await fs.lstatAsync(files.createSymlink.src);
	test.true(stats.isSymbolicLink());
});

ava('createSymlink (new)', async test => {
	const newDir = resolve(dir, 'createSymlinkNew');
	await nextra.createSymlink(files.createSymlink.src, newDir);

	const stats = await fs.lstatAsync(files.createSymlink.src);
	test.true(stats.isSymbolicLink());
});

ava('createSymlink (new recursive)', async test => {
	const deepDir = resolve(dir, 'createSymlinkNew2', 'createSymlinkNew3');
	await nextra.createSymlink(files.createSymlink.src, deepDir);

	const stats = await fs.lstatAsync(files.createSymlink.src);
	test.true(stats.isSymbolicLink());
});

// createSymlinkAtomic

ava('createSymlinkAtomic (pre-existing)', async test => {
	await nextra.createLinkAtomic(files.createSymlink.src, files.createSymlink.dest);

	const stats = await fs.lstatAsync(files.createSymlink.dest);
	test.true(stats.isSymbolicLink());
});

ava('createSymlinkAtomic (new)', async test => {
	const newDir = resolve(dir, 'createSymlinkNew');
	await nextra.createLinkAtomic(files.createSymlink.src, newDir);

	const stats = await fs.lstatAsync(newDir);
	test.true(stats.isSymbolicLink());
});

ava('createSymlinkAtomic (new recursive)', async test => {
	const deepDir = resolve(dir, 'createSymlinkNew2', 'createSymlinkNew3');
	await nextra.createLinkAtomic(files.createSymlink.src, deepDir);

	const stats = await fs.lstatAsync(deepDir);
	test.true(stats.isSymbolicLink());
});

// emptyDir

ava('emptyDir (empty)', async test => {
	await nextra.emptyDir(files.emptyDir.empty);

	const contents = await fs.readdirAsync(files.emptyDir.empty);
	test.true(contents.length === 0);
});

ava('emptyDir (full)', async test => {
	await nextra.emptyDir(files.emptyDir.full);

	const contents = await fs.readdirAsync(files.emptyDir.full);
	test.true(contents.length === 0);
});

// ensureDir

ava('ensureDir (pre-existing)', async test => {
	await nextra.ensureDir(files.ensureDir);

	const stats = await fs.statAsync(files.ensureDir);
	test.true(stats.isDirectory());
});

ava('ensureDir (new)', async test => {
	const newDir = resolve(dir, 'ensureDirNew');
	await nextra.ensureDir(newDir);

	const stats = await fs.statAsync(newDir);
	test.true(stats.isDirectory());
});

ava('ensureDir (new recursive)', async test => {
	const deepDir = resolve(dir, 'ensureDirNew2', 'ensureDirNew3');
	await nextra.ensureDir(deepDir);

	const stats = await fs.statAsync(deepDir);
	test.true(stats.isDirectory());
});

// linkAtomic

ava('linkAtomic', async test => {
	const newFile = resolve(dir, 'linkAtomicNew.txt');
	await nextra.linkAtomic(files.createlink.src, newFile);

	const stats = await fs.statAsync(newFile);
	test.true(stats.isFile());
});

// move

ava('move', async test => {
	test.plan(2);
	const move = resolve(dir, 'moved');
	await nextra.move(files.copy, move);

	test.throws(fs.statAsync(files.copy));
	test.notThrows(fs.statAsync(move));
});

// outputFile

ava('outputFile (pre-existing)', async test => {
	await nextra.outputFile(files.createFile, 'pass');

	test.is(await fs.readFileAsync(files.createFile, 'utf8'), 'pass');
});

ava('outputFile (new)', async test => {
	const newDir = resolve(dir, 'outputFileNew');
	await nextra.outputFile(newDir, 'pass');

	test.is(await fs.readFileAsync(newDir, 'utf8'), 'pass');
});

ava('outputFile (new recursive)', async test => {
	const deepDir = resolve(dir, 'outputFileNew2', 'outputFileNew3');
	await nextra.outputFile(deepDir, 'pass');

	test.is(await fs.readFileAsync(deepDir, 'utf8'), 'pass');
});

// outputFileAtomic

ava('outputFileAtomic (pre-existing)', async test => {
	await nextra.outputFileAtomic(files.createFile, 'pass');

	test.is(await fs.readFileAsync(files.createFile, 'utf8'), 'pass');
});

ava('outputFileAtomic (new)', async test => {
	const newDir = resolve(dir, 'outputFileNew');
	await nextra.outputFileAtomic(newDir, 'pass');

	test.is(await fs.readFileAsync(newDir, 'utf8'), 'pass');
});

ava('outputFileAtomic (new recursive)', async test => {
	const deepDir = resolve(dir, 'outputFileNew2', 'outputFileNew3');
	await nextra.outputFileAtomic(deepDir, 'pass');

	test.is(await fs.readFileAsync(deepDir, 'utf8'), 'pass');
});

// outputJSON

ava('outputJSON (pre-existing)', async test => {
	const obj = { test: 'passed' };
	await nextra.outputJSON(files.createFile, obj);

	test.is(await fs.readFileAsync(files.createFile, 'utf8'), JSON.stringify(obj));
});

ava('outputJSON (new)', async test => {
	const newDir = resolve(dir, 'outputJSONNew');
	const obj = { test: 'passed' };
	await nextra.outputJSON(newDir, obj);

	test.is(await fs.readFileAsync(newDir, 'utf8'), JSON.stringify(obj));
});

ava('outputJSON (new recursive)', async test => {
	const deepDir = resolve(dir, 'outputJSONNew2', 'outputJSONNew3');
	const obj = { test: 'passed' };
	await nextra.outputJSON(deepDir, obj);

	test.is(await fs.readFileAsync(deepDir, 'utf8'), JSON.stringify(obj));
});

// outputJSONAtomic

ava('outputJSONAtomic (pre-existing)', async test => {
	const obj = { test: 'passed' };
	await nextra.outputJSONAtomic(files.createFile, obj);

	test.is(await fs.readFileAsync(files.createFile, 'utf8'), JSON.stringify(obj));
});

ava('outputJSONAtomic (new)', async test => {
	const newDir = resolve(dir, 'outputJSONNew');
	const obj = { test: 'passed' };
	await nextra.outputJSONAtomic(newDir, obj);

	test.is(await fs.readFileAsync(newDir, 'utf8'), JSON.stringify(obj));
});

ava('outputJSONAtomic (new recursive)', async test => {
	const deepDir = resolve(dir, 'outputJSONNew2', 'outputJSONNew3');
	const obj = { test: 'passed' };
	await nextra.outputJSONAtomic(deepDir, obj);

	test.is(await fs.readFileAsync(deepDir, 'utf8'), JSON.stringify(obj));
});

// pathExists

ava('pathExists (dir true)', async test => {
	test.true(await nextra.pathExists(files.pathExists.dir));
});

ava('pathExists (file true)', async test => {
	test.true(await nextra.pathExists(files.pathExists.file));
});

ava('pathExists (dir false)', async test => {
	const noExist = resolve(dir, 'pathDoesntExist');
	test.false(await nextra.pathExists(noExist));
});

ava('pathExists (file false)', async test => {
	const noExist = resolve(dir, 'pathDoesntExist.txt');
	test.false(await nextra.pathExists(noExist));
});

// readJSON

ava('readJSON', async test => {
	const readJSON = await nextra.readJSON(files.readJSON);
	test.true(readJSON.validate);
});

// remove

ava('remove', async test => {
	const file = resolve(files.emptyDir.full, 'file.txt');
	await nextra.remove(file);

	test.throws(fs.statAsync(file));
});

// symlinkAtomic

ava('symlinkAtomic', async test => {
	const file = resolve(dir, 'file.txt');
	await nextra.symlinkAtomic(files.createSymlink.src, file);

	const stats = await fs.lstatAsync(file);
	test.true(stats.isSymbolicLink());
});

// writeFileAtomic

ava('writeFileAtomic', async test => {
	const file = resolve(dir, 'file.txt');
	const data = 'passed';
	await nextra.writeFileAtomic(file, data);

	test.is(await fs.readFileAsync(file, 'utf8'), data);
});

// writeJSON

ava('writeJSON', async test => {
	const file = resolve(dir, 'file.json');
	const obj = { test: 'passed' };
	await nextra.writeJSON(file, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});

// writeJSONAtomic

ava('writeJSONAtomic', async test => {
	const file = resolve(dir, 'file.json');
	const obj = { test: 'passed' };
	await nextra.writeJSONAtomic(file, obj);

	test.deepEqual(JSON.parse(await fs.readFileAsync(file, 'utf8')), obj);
});
