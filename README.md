# parsonic
Parsonic is an ultra fast HTML5 parser module for Node.js, using Nightmarejs and native chromium functions.

Once parsonic is loaded, parsing a page with it is ~3x faster than cheerio and ~12x faster than jsdom.

Here is a simple example:
```js
var parsonic = require("parsonic")
require("request")("https://github.com", function(err, res, html){
    if(err) throw err
    parsonic.load(html, {selector:"*", anyData:"Hello world!"}, function(document, args){
      /*We're out of Node.js scope, we can only use data from "args" and document,
      however this is not headless scraping: <script> are not executed and window isn't accessible.
      You can't return a DOM element, you must return your own variables/objects.*/
      return document.querySelectorAll(args.selector).length
    },
    function(results){
        if(results.error){
            console.log(results.error)
        }
        else{
            /*We're back in Node.js, with the value that we returned*/
            console.log(results)
        }
    })

})
```

If you don't need parsonic anymore, you can kill it to free memory using parsonic.kill().
