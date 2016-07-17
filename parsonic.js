"use strict";
const Nightmare = require("nightmare"),
nightmare = Nightmare({ show: false, width: 0, height: 0 })
const toSource = require("tosource")
const events = require("events")
class BrowserEmitter extends events {}
const browserEmitter = new BrowserEmitter()
var load
var toExecuteOnLoad = []
browserEmitter.on("load", () => {
    toExecuteOnLoad.filter(function(f){
        f()
    })    
})
nightmare.goto('about:blank')
.then(() => {
    load = function(html, args, browserCallback, nodeFunction){
        nightmare.evaluate(function(html, args, browserCallbackSource){
            var window = null;
            var document = new DOMParser().parseFromString(html, "text/html")
            var results
            try{
                results = eval("(" + browserCallbackSource + ")(document, args)")
            }
            catch(err){
                results = {error: "Error from the browser: " + err.stack}
            }
            return results
        }, html, args, toSource(browserCallback))
        .then(nodeFunction)
    }
    browserEmitter.emit("load")

})
exports.load = function(html, args, browserCallback, nodeFunction){
    if(typeof load === "function"){
        load(html, args, browserCallback, nodeFunction)
    }
    else{
        toExecuteOnLoad.push(function(){load(html, args, browserCallback, nodeFunction)})
    }
}
exports.close = function(){
    require('child_process').exec('kill -9 ' + nightmare.proc.pid, function(){
        console.log("nightmare was terminated")
    })
}
