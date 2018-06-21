const gmagick = require('gm');

/**
 *
 * Sanitizes a file-type extension
 *
 */
function getImageFormat (extension) {
  switch (extension) {
  case '.jpg':
    return 'jpeg';
  case '.gif':
    return 'gif';
  default:
    return 'png';
  }
}

const dimensionMax = 5000;
const defaultColor = 'CCC';
const defaultTextColor = '000';

const dummyImage = (req, res, next) => {
  let err;
  const width = req.params[0];
  const height = req.params[1] || width;
  const color = req.query.color || defaultColor;
  const text = req.query.text || `${width} x ${height}`;
  const textColor = req.query.textColor || defaultTextColor;
  const format = getImageFormat(req.params[2]);

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
};

module.exports = dummyImage;
