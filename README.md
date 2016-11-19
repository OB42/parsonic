# parsonic
Parsonic is a node.js wrapper for the native Chromium Html DOMParser,

once it's loaded, parsonic is ~3x times faster than cheerio

Here is an example:
```js
var parsonic = require("parsonic");
var request = require("request");
request("https://github.com", (err, res, html) => {
	parsonic.load(html, {selector:"*", anyData:"Hello world!"}, function(document, args){
		/*We're out of Node.js scope, we can only use data from "args" and document,
		however this is not headless scraping: <script> are not executed and window isn't accessible.
		You can't return a DOM element, you must return your own variables/objects.*/
		return document.querySelectorAll(args.selector).length
	},
	(err, results) => {
		if (err)
		{
			console.log(err)
		}
		else{
			/*We're back in Node.js, with the value that we returned*/
			console.log(results)
		}
	});
});
```

If you don't need parsonic anymore, you can kill it to free memory using parsonic.close().
	
