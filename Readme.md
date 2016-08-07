# Placeholder image generator

```
brew install graphicsmagick
brew install ghostscript
```

```
npm install --save-dev placehold
```

## Getting images

Construct a URL like so:

```
http://localhost:[port]/[width]x[height]/[format][?query=params]
```

- **port** - By default this is `9999`. You will know if it is set to something else.

- **width** - The desired image width.

- **height** - The desired image height. If left off, the resulting image will be square: {width} x {width}.

- **format** - This can be `.png`, `.jpg` or `.gif`. It is optional and defaults to `.png`

- **query** - Further options can be specified here:

    `color` - must be a hex value without the `#`. Default is 'ccc'.
    `textColor` - must be a hex value without the `#`. Default is '000'.
    `text` - The text to display. Default is '{width} x {height}'.

### Examples

- `/400x500` gets you a 400x500 .png with black text and a
grey background

- `/480x360.jpg?text=Placeholder` gets you a 480x360 .jpg displaying the
text 'Placeholder'

- `/500x100.png?color=000&textColor=fff` gets you a .png with white text
and a black background

- `/250` gets you a 250x250 image
