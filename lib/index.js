'use strict';
const ssri = require('ssri');
const fs = require('fs');
const path = require('path');

module.exports = ({basePath, algorithms = ['sha512']}) => {
	function posthtmlSri(tree) {
		const jobs = [];
		const parseAttr = attr => node => {
			const src = node.attrs[attr];
			if (src) {
				jobs.push(
					ssri.fromStream(fs.createReadStream(path.join(basePath, src)), {algorithms}).then(integrity => {
						node.attrs.integrity = integrity.toString();
					})
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
