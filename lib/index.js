'use strict';
const ssri = require('ssri');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

module.exports = ({basePath, algorithms = ['sha512']}) => {
	function posthtmlSri(tree) {
		const jobs = [];

		const fetchStream = value => fetch(new URL(value)).then(response => response.body);
		const pathStream =
			basePath === undefined
				? fetchStream
				: value => {
						// If it is a remote source, do not prepend a base path.
						try {
							return fetchStream(value);
						} catch (error) {
							if (error.code === 'ERR_INVALID_URL')
								return Promise.resolve(fs.createReadStream(path.join(basePath, value)));
							throw error;
						}
				  };

		const parseAttr = attr => node => {
			const src = node.attrs[attr];
			if (src) {
				jobs.push(
					pathStream(src).then(stream =>
						ssri.fromStream(stream, {algorithms}).then(integrity => {
							node.attrs.integrity = integrity.toString();
						})
					)
				);
			}

			return node;
		};

		tree.match({tag: 'script'}, parseAttr('src'));
		tree.match({tag: 'link'}, parseAttr('href'));
		return Promise.all(jobs).then(() => tree);
	}

	return posthtmlSri;
};
