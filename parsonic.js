"use strict";
const Nightmare = require("nightmare");
const nightmare = Nightmare({
	show: false,
	width: 0,
	height: 0,
	executionTimeout: 5000
});
const events = require("events");
class Browser_Emitter extends events {};
const browser_emitter = new Browser_Emitter();
var load;
var onload = [];
browser_emitter.on("load", () => {
	onload.forEach((f) => f());
});
nightmare
.goto('about:blank')
.then(() => {
	load = (html, args, browser_callback, node_callback) => {
		nightmare.evaluate((html, args, browser_callback_source) => {
			var result;
			var window = null;
			try
			{
				var document = new DOMParser().parseFromString(html, "text/html");
				result = eval("(" + browser_callback_source + ")(document, args)");
			}
			catch (err)
			{
				result = {error: "Error from the browser: " + err.stack};
			}
			return (result);
		}, html, args, browser_callback.toString())
		.then((result) => {
			node_callback(result.error || null, result.error ? null : result);
		})
		.catch((error) => node_callback(error));
	};
	browser_emitter.emit("load");
});
exports.load = (html, args, browser_callback, node_callback) => {
	if (typeof load === "function")
	{
		load(html, args, browser_callback, node_callback);
	}
	else
	{
		onload.push(() => load(html, args, browser_callback, node_callback));
	}
};
exports.close = () => {
	nightmare.proc.kill('SIGINT');
};
