// node --test test/  (npm test)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { SCHOOL_PRINTERS, DEFAULT_PRINTER, isSchoolPrinter } from '../src/kiri/app/edu-printers.js';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function langMap(file) {
    const self = { lang: {} };
    vm.runInNewContext(fs.readFileSync(path.join(root, 'web/kiri/lang', file), 'utf8'), { self });
    return self.lang;
}

test('every school printer has a stock profile', () => {
    for (const name of SCHOOL_PRINTERS) {
        assert.ok(fs.existsSync(path.join(root, 'src/kiri/dev/fdm', `${name}.json`)), name);
    }
    assert.ok(SCHOOL_PRINTERS.includes(DEFAULT_PRINTER));
});

test('the printer list keeps school printers and a teacher\'s own copies only', () => {
    assert.equal(isSchoolPrinter('Creality.Ender.3'), true);
    assert.equal(isSchoolPrinter('My Creality.Ender.3'), true);
    assert.equal(isSchoolPrinter('My.Bambu.P1S'), false);
    assert.equal(isSchoolPrinter('Wanhao.Duplicator_6'), false);
});

test('Ukrainian strings use only keys of the English map, with non-empty values', () => {
    const en = langMap('en.js').en;
    const uk = langMap('uk.js').uk;
    assert.ok(Object.keys(uk).length > 300);
    for (const [key, value] of Object.entries(uk)) {
        assert.ok(key in en, `unknown key ${key}`);
        const text = Array.isArray(value) ? value.join('') : value;
        assert.ok(text.trim().length > 0, `empty ${key}`);
    }
});

test('every key of uk.js comes from tools/uk_strings.py', () => {
    const before = fs.readFileSync(path.join(root, 'web/kiri/lang/uk.js'), 'utf8');
    // make_uk.py is deterministic: regenerate into memory by reading the source dictionary keys
    const py = fs.readFileSync(path.join(root, 'tools/uk_strings.py'), 'utf8');
    for (const key of Object.keys(langMap('uk.js').uk)) {
        assert.ok(py.includes(`'${key}':`), `uk.js has ${key} but uk_strings.py does not`);
    }
    assert.ok(before.startsWith('// Ukrainian (EduProstir)'));
});
