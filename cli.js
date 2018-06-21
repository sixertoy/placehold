/* global require, process */
(function () {
  let path = require('path'),
    gmagick = require('gm'),
    express = require('express'),
    argv = require('yargs').argv,
    lookuproot = require('lookuproot'),
    // variables
    APP_PORT,
    pkg,
    app = express(),
    dimensionMax = 5000,
    defaultColor = 'CCC',
    defaultTextColor = '000',
    regex = new RegExp(/\/(\d+)(?:x((\d+)))?(.\w+)?/);

  if (argv.hasOwnProperty('port') && typeof argv.port === 'number' && argv.port) {
    // if use command line option --port
    APP_PORT = argv.port;
  } else {
    try {
      // in package.json
      pkg = path.join(process.cwd(), 'package.json');
      pkg = require(pkg);
      if (!pkg.hasOwnProperty('placehold')) {
        throw new Error('No property `placehold` in current package.json');
      }
      APP_PORT = pkg.placehold;
    } catch (e) {
      // check .env file project > user's home > module directory
      require('dotenv').config({
        path: lookuproot('.env'),
      });
      APP_PORT = process.env.PLACEHOLD_PORT;
    }
  }

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

  app.get(regex, (req, res, next) => {
    let err,
      width = req.params[0],
      height = req.params[1] || width,
      color = req.query.color || defaultColor,
      text = req.query.text || `${width} x ${height}`,
      textColor = req.query.textColor || defaultTextColor,
      format = __getFormat(req.params[2]);

    if (width > dimensionMax || height > dimensionMax) {
      err = new Error(`Maximum dimension exceeded (${dimensionMax})`);
      err.statusCode = 400;
      return next(err);
    }

    gmagick(width, height, `#${color}`)
      // Center the text
      .gravity('Center')
      // Background colour
      .fill(`#${textColor}`)
      // Scale font-size according to image dimensions
      .pointSize(30 * (parseInt(Math.min(width, height), 10) / 200))
      // Draw the text
      .drawText(0, 0, text)
      // Get a readable stream of the image data
      .stream(format, (error, stdout, stderr) => {
        // Pass err to the error handling middleware
        if (error) {
          return next(error);
        }
        // Set cache headers
        res.set({
          Date: new Date().toUTCString(),
          'Content-Type': `image/${format}`,
          'Last-Modified': new Date().toUTCString(),
          'Cache-Control': 'max-age=315360000,public',
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

  app.listen(APP_PORT, () => {
    // eslint-disable-next-line
    console.log('Placeholder image server running at: http://localhost:' + APP_PORT);
  });
}());
