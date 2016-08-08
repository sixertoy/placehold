/* global require, process */
(function() {

    'use strict';

    var gmagick = require('gm'),
        express = require('express'),
        lookuproot = require('lookuproot'),
        // variables
        APP_PORT,
        app = express(),
        dimensionMax = 5000,
        defaultColor = 'ccc',
        defaultTextColor = '000',
        regex = new RegExp(/\/(\d+)(?:x((\d+)))?(.\w+)?/);

    // if (args.port is found) {
    // APP_PORT = args
    // } else {
    require('dotenv').config({
        path: lookuproot('.env')
    });
    APP_PORT = process.env.PLACEHOLD_PORT;
    // }

    /**
    *
    * Sanitizes a file-type extension
    *
    */
    function __getFormat (extension) {
        switch (extension) {
        case '.jpg':
            return 'jpeg';
        case '.gif':
            return 'gif';
        default:
            return 'png';
        }
    }

    app.get(regex, function(req, res, next) {
        var err,
            width = req.params[0],
            height = req.params[1] || width,
            color = req.query.color || defaultColor,
            text = req.query.text || (width + ' x ' + height),
            textColor = req.query.textColor || defaultTextColor,
            format = __getFormat(req.params[2]);

        if (width > dimensionMax || height > dimensionMax) {
            err = new Error('Maximum dimension exceeded (' + dimensionMax + ')');
            err.statusCode = 400;
            return next(err);
        }

        gmagick(width, height, '#' + color)
            // Center the text
            .gravity('Center')
            // Background colour
            .fill('#' + textColor)
            // Scale font-size according to image dimensions
            .pointSize(30 * (parseInt(Math.min(width, height), 10) / 200))
            // Draw the text
            .drawText(0, 0, text)
            // Get a readable stream of the image data
            .stream(format, function __onStreamData__ (error, stdout, stderr) {
                // Pass err to the error handling middleware
                if (error) {
                    return next(error);
                }
                // Set cache headers
                res.set({
                    'Date': new Date().toUTCString(),
                    'Content-Type': 'image/' + format,
                    'Last-Modified': new Date().toUTCString(),
                    'Cache-Control': 'max-age=315360000,public'
                });
                // Pipe image data stream to the response
                stdout.pipe(res);
                // Pipe any stdout data to the process.stdout
                // so that it can be retrieved in the logs
                stderr.pipe(process.stdout);
                return true;
            });
        return true;
    });


    app.listen(APP_PORT, function __onRunning__ () {
        console.log('Placeholder image server running at: http://localhost:' + APP_PORT);
    });

}());
