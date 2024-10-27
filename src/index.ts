import {join} from 'node:path';
import {createReadStream} from 'node:fs';
import {Readable} from 'node:stream';
import ssri from 'ssri';
import type {NodeAPI, NodeCallback} from 'posthtml';

export = ({
	basePath,
	algorithms = ['sha512'],
	cache = {},
	fetch = globalThis.fetch
}: {
	basePath?: string;
	algorithms?: string[];
	cache?: Record<string, string>;
	fetch?: (url: URL | RequestInfo) => Promise<Response>;
}) => {
	const posthtmlSri = async (tree: NodeAPI) => {
		const jobs: Array<Promise<void>> = [];

		const parseAttribute =
			(attribute): NodeCallback =>
			node => {
				if (node.attrs === undefined || node.attrs.integrity !== undefined) return node;

				const {attrs} = node;

				const source = attrs[attribute];
				if (source === undefined) return node;

				if (source in cache) {
					node.attrs.integrity = cache[source];
					return node;
				}

				jobs.push(
					(async () => {
						let stream: Readable | undefined;
						try {
							// Assume it's a remote asset
							const {body} = await fetch(new URL(source));
							if (body === null) throw new Error(`Error fetching URL from ${source}: Empty body.`);
							const bodyReader = body.getReader();
							stream = new Readable({
								async read() {
									const {done, value} = await bodyReader.read();

									if (done) {
										this.push(null);
									} else {
										this.push(Buffer.from(value));
									}
								}
							});
						} catch (error: any) {
							if (error instanceof Error) {
								if ('code' in error && error.code === 'ERR_INVALID_URL') {
									if (basePath === undefined) {
										console.warn(`posthtml-sri: Ignoring ${source}\nIf this is a local file, add the basePath option.`);
									} else {
										// This is likely a local asset
										stream = createReadStream(join(basePath, source));
									}
								} else {
									throw error;
								}
							}
						}

						if (stream !== undefined) {
							const integrity = await ssri.fromStream(stream, {algorithms});
							attrs.integrity = integrity.toString();
							cache[source] = attrs.integrity;
						}
					})()
				);

				return node;
			};

		tree.match({tag: 'script', attrs: {src: /.*/}}, parseAttribute('src'));
		tree.match({tag: 'link', attrs: {href: /.*/}}, parseAttribute('href'));
		await Promise.all(jobs);
		return tree;
	};

	return posthtmlSri;
};
