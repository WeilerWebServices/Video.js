import window from 'global/window';
import QUnit from 'qunit';
import sinon from 'sinon';
import videojs from 'video.js';
import plugin from '../src/plugin';

QUnit.test('the environment is sane', function(assert) {
  assert.strictEqual(typeof Array.isArray, 'function', 'es5 exists');
  assert.strictEqual(typeof sinon, 'object', 'sinon exists');
  assert.strictEqual(typeof videojs, 'function', 'videojs exists');
  assert.strictEqual(typeof plugin, 'function', 'plugin is a function');
});

QUnit.test('the qs method returns a querystring clone', function(assert) {
  assert.strictEqual(typeof videojs.qs, 'function', 'plugin is a function');

  const qs = videojs.qs();

  ['parse', 'stringify'].forEach(k => {
    assert.strictEqual(typeof qs[k], 'function', `has a ${k}() method`);
  });

  assert.notStrictEqual(videojs.qs(), qs, 'a clone is always returned');
});

QUnit.test('the plugin returns a querystring clone', function(assert) {
  assert.strictEqual(typeof videojs.getPlugin('qs'), 'function', 'plugin is a function');

  const qs = videojs.getPlugin('qs')();

  ['parse', 'stringify'].forEach(k => {
    assert.strictEqual(typeof qs[k], 'function', `has a ${k}() method`);
  });

  assert.notStrictEqual(videojs.getPlugin('qs')(), qs, 'a clone is always returned');
});

QUnit.test('the querystring clone has an added "search" property matching the parsed window.location.search', function(assert) {
  const qs = videojs.qs();

  assert.strictEqual(typeof qs.search, 'object', 'the "search" property exists');
  assert.deepEqual(qs.parse(window.location.search.substr(1)), qs.search, 'the "search" property has the expected contents');
});
