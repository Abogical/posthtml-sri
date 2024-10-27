import {readFileSync} from 'node:fs';
import path from 'node:path';
import test from 'ava';
import posthtml from 'posthtml';
import plugin from '../dist/index.js';

const fixtures = path.join(import.meta.dirname, 'fixtures');

test('basic', t => {
	return compare(t, 'basic');
});

test('avoid fetching when cached', t => {
	return ensureNoFetch(t, 'basic');
});

async function compare(t, name) {
	const source = readFileSync(path.join(fixtures, `${name}.html`), 'utf8');
	const expected = readFileSync(path.join(fixtures, `${name}.expected.html`), 'utf8');
	const {html} = await posthtml([plugin({basePath: fixtures})]).process(source);

	t.deepEqual(html, expected);
}

async function ensureNoFetch(t, name) {
	const fetch = () => {
		throw new Error('called fetch despite cache');
	};

	const cache = {
		'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js':
			'sha512-iceXjjbmB2rwoX93Ka6HAHP+B76IY1z0o3h+N1PeDtRSsyeetU3/0QKJqGyPJcX63zysNehggFwMC/bi7dvMig==',
		'basic.js': 'sha512-MUS7Gdcgr3In98ODhITyPjXWdWE9dezoOcyopcyYXzpFz2LrOApCRupkTwgiaS31+DhQacgbQ5T1hlGWPiBNGQ==',
		'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css':
			'sha512-oc9+XSs1H243/FRN9Rw62Fn8EtxjEYWHXRvjS43YtueEewbS6ObfXcJNyohjHqVKFPoXXUxwc+q1K7Dee6vv9g=='
	};

	const source = readFileSync(path.join(fixtures, `${name}.html`), 'utf8');
	const expected = readFileSync(path.join(fixtures, `${name}.expected.html`), 'utf8');
	const {html} = await posthtml([plugin({basePath: fixtures, cache, fetch})]).process(source);

	t.is(
		cache['basic.css'],
		'sha512-CVazCeMWuNKPH6VzeuYxVGC3JKXVQB/wqncMrpHoS3wJclPNeKN+SxO/zz1A9U3s2zczk/Yx1iZEJ6+CwJW81A=='
	);

	t.deepEqual(html, expected);
}
