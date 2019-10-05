const util = require('util');
const express = require('express');

module.exports = function handleFunc(fn) {

    let isAsync = util.types.isAsyncFunction(fn)
    if (!isAsync) {
        fn = util.promisify(fn);
    }

    return async function(req, res) {
        try {
            let results = await fn(req, res)
            if(!!results && Object.getPrototypeOf(results) !== express.Response) {
                res.send(results);                                
            }

        } catch (e) {
            console.log(e)
            res.status(500);
            res.send(e.message);
        }
    }
}