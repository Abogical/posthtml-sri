'use strict';
const ssri = require('ssri');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

module.exports = ({basePath, algorithms = ['sha512']}) => {
	function posthtmlSri(tree) {
		const jobs = [];

		const parseAttr = attr => node => {
			const src = node.attrs[attr];
			if (src) {
				jobs.push(
					(async () => {
						let stream;
						try {
							// Assume it's a remote asset
							stream = (await fetch(new URL(src))).body;
						} catch (error) {
							if (error.code === 'ERR_INVALID_URL') {
								if (basePath === undefined) {
									console.warn(`posthtml-sri: Ignoring ${src}\nIf this is a local file, add the basePath option.`);
								} else {
									// This is likely a local asset
									stream = fs.createReadStream(path.join(basePath, src));
								}
							} else {
								throw error;
							}
						}

						node.attrs.integrity = (await ssri.fromStream(stream, {algorithms})).toString();
					})()
				);
			}

			return node;
		};

		tree.match({tag: 'script', attrs: {src: /.*/}}, parseAttr('src'));
		tree.match({tag: 'link', attrs: {href: /.*/}}, parseAttr('href'));
		return Promise.all(jobs).then(() => tree);
	}

	return posthtmlSri;
};
