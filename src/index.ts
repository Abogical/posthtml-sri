import ssri from 'ssri';
import {createReadStream} from 'fs';
import {join} from 'path';
import nodeFetch from 'node-fetch';

export = ({
	basePath,
	algorithms = ['sha512'],
	cache = {},
	fetch = nodeFetch
}: {
	basePath?: string;
	algorithms?: string[];
	cache?: Record<string, string>;
	fetch?: (url: URL) => Promise<{body: NodeJS.ReadableStream}>;
}) => {
	const posthtmlSri = async tree => {
		const jobs = [];

		const parseAttr = attr => node => {
			const src = node.attrs[attr] as string;
			if (node.attrs.integrity === undefined) {
				if (Object.prototype.hasOwnProperty.call(cache, src)) {
					node.attrs.integrity = cache[src];
					return node;
				}

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
									stream = createReadStream(join(basePath, src));
								}
							} else {
								throw error;
							}
						}

						const integrity = (await ssri.fromStream(stream, {algorithms})).toString();
						node.attrs.integrity = integrity;
						cache[src] = integrity;
					})()
				);
			}

			return node;
		};

		tree.match({tag: 'script', attrs: {src: /.*/}}, parseAttr('src'));
		tree.match({tag: 'link', attrs: {href: /.*/}}, parseAttr('href'));
		await Promise.all(jobs);
		return tree;
	};

	return posthtmlSri;
};
