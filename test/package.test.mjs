// Runs against the built files, the way consumers load the package.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Minimal browser globals: enough for init() to queue calls and add the script tag.
function fakeBrowser() {
  const appended = [];
  globalThis.window = {};
  globalThis.document = {
    createElement: () => ({ addEventListener() {} }),
    getElementsByTagName: () => [{ appendChild: (el) => appended.push(el) }],
  };
  return appended;
}

function cleanBrowser() {
  delete globalThis.window;
  delete globalThis.document;
}

test('is not mistaken for a promise or a transpiled module', async () => {
  cleanBrowser();
  const Tap = require('@tapfiliate/tapfiliate-js');
  assert.equal(Tap.then, undefined);
  assert.equal(Tap.__esModule, undefined);
  assert.equal(await Promise.resolve(Tap), Tap);
});

test('loads with require() and with import, without touching window (server-side rendering)', async () => {
  cleanBrowser();
  const cjs = require('@tapfiliate/tapfiliate-js');
  const esm = (await import('@tapfiliate/tapfiliate-js')).default;
  assert.equal(typeof cjs.init, 'function');
  assert.equal(typeof cjs.default.init, 'function');
  assert.equal(typeof esm.init, 'function');
});

for (const [format, load] of [
  ['CommonJS', async () => require('../dist/index.cjs')],
  ['ES module', async () => (await import(`../dist/index.mjs?${Date.now()}`)).default],
]) {
  test(`${format}: init loads tapfiliate.js once and queues create and detect`, async () => {
    const appended = fakeBrowser();
    const Tap = await load();
    Tap.init('ACCOUNT_ID');
    Tap.init('ACCOUNT_ID');
    assert.equal(appended.length, 1);
    assert.equal(appended[0].src, 'https://script.tapfiliate.com/tapfiliate.js');
    const queued = window.__tap.q.map((args) => [...args]);
    assert.deepEqual(queued[0].slice(0, 3), ['create', 'ACCOUNT_ID', { integration: 'npm-module' }]);
    assert.equal(queued[1][0], 'detect');
    cleanBrowser();
  });

  test(`${format}: other methods are forwarded to tapfiliate.js`, async () => {
    fakeBrowser();
    const Tap = await load();
    Tap.init('ACCOUNT_ID');
    Tap.conversion('ORDER-1', 99.5, { customer_id: 'C-1' });
    const last = [...window.__tap.q.at(-1)];
    assert.deepEqual(last, ['conversion', 'ORDER-1', 99.5, { customer_id: 'C-1' }]);
    cleanBrowser();
  });
}
