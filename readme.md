# posthtml-sri

PostHTML plugin that calculates and adds [subresource integrity (SRI)] attributes.

Before:

```html
<html>
	<head>
		<script
			src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"
			crossorigin="anonymous"
		></script>
		<link
			rel="stylesheet"
			href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
			crossorigin="anonymous"
		/>
	</head>
</html>
```

After:

```html
<html>
	<head>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous" integrity="sha512-iceXjjbmB2rwoX93Ka6HAHP+B76IY1z0o3h+N1PeDtRSsyeetU3/0QKJqGyPJcX63zysNehggFwMC/bi7dvMig=="></script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" crossorigin="anonymous" integrity="sha512-oc9+XSs1H243/FRN9Rw62Fn8EtxjEYWHXRvjS43YtueEewbS6ObfXcJNyohjHqVKFPoXXUxwc+q1K7Dee6vv9g==">
	</head>
</html>
```

## Install

```bash
npm i posthtml-sri
```

## Usage

### Example

```js
const fs = require('fs');
const posthtml = require('posthtml');
const posthtmlSri = require('posthtml-sri');

posthtml()
	.use(
		posthtmlSri({
			/* options */
		})
	)
	.process(html /*, options */)
	.then(result => fs.writeFileSync('./after.html', result.html));
```

## Options

### `basePath`

Base path to look for local assets. Asset paths in the HTML are prepended with this option to find and hash the local file.

> Make sure that the local assets the HTML uses are processed first (i.e. transpiled, minified, etc.) before using this plugin to hash them correctly.

Before:
```html
<html>
	<head>
		<script src="script.js"></script>
		<link rel="stylesheet" href="style.css" />
	</head>
</html>
```

Add option:

```js
const fs = require('fs');
const posthtml = require('posthtml');
const posthtmlSri = require('posthtml-sri');

posthtml()
	.use(posthtmlSri({ basePath: 'assets' }))
	.process(html)
	.then(result => fs.writeFileSync('./after.html', result.html));
```

After:

```html
<html>
	<head>
		<script src="script.js" integrity="sha512-MUS7Gdcgr3In98ODhITyPjXWdWE9dezoOcyopcyYXzpFz2LrOApCRupkTwgiaS31+DhQacgbQ5T1hlGWPiBNGQ=="></script>
		<link rel="stylesheet" href="style.css" integrity="sha512-CVazCeMWuNKPH6VzeuYxVGC3JKXVQB/wqncMrpHoS3wJclPNeKN+SxO/zz1A9U3s2zczk/Yx1iZEJ6+CwJW81A==">
	</head>
</html>
```

### `algorithms`

Array of hash algorithms to use. By default it follows the [ssri] default, currently `['sha512']`.

Before:

```html
<html>
	<head>
		<script
			src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js"
			crossorigin="anonymous"
		></script>
		<link
			rel="stylesheet"
			href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css"
			crossorigin="anonymous"
		/>
	</head>
</html>
```

Add option:

```js
const fs = require('fs');
const posthtml = require('posthtml');
const posthtmlSri = require('posthtml-sri');

posthtml()
	.use(posthtmlSri({ algorithms: ['sha512', 'sha384'] }))
	.process(html)
	.then(result => fs.writeFileSync('./after.html', result.html));
```

After:

```html
<html>
	<head>
		<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous" integrity="sha512-iceXjjbmB2rwoX93Ka6HAHP+B76IY1z0o3h+N1PeDtRSsyeetU3/0QKJqGyPJcX63zysNehggFwMC/bi7dvMig== sha384-ho+j7jyWK8fNQe+A12Hb8AhRq26LrZ/JpcUGGOn+Y7RsweNrtN/tE3MoK7ZeZDyx"></script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" crossorigin="anonymous" integrity="sha512-oc9+XSs1H243/FRN9Rw62Fn8EtxjEYWHXRvjS43YtueEewbS6ObfXcJNyohjHqVKFPoXXUxwc+q1K7Dee6vv9g== sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2">
	</head>
</html>
```

[subresource integrity (sri)]: https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
[ssri]: https://www.npmjs.com/package/ssri
