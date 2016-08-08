# Placeholder image generator

#### Install on Mac
```bash
brew install graphicsmagick
brew install ghostscript
npm install -g placehold
```

#### Command line

Set port using command line option
```bash
placehold --port 9999
```

Set port using `<my_project>/package.json` property
```javascript
{
  ...
  "placehold": 9999,
  ...
}
```
```bash
cd <my_project>
placehold
```

Set port using .env file (default)
```text
# in <my_project>/.env file
PLACEHOL_PORT=9999
```
```bash
cd <my_project>
placehold
```

### Examples

**250x250px image file in .png format (default)**
```html
http://localhost:<port>/250
```

**.gif image file**
```html
http://localhost:<port>/400x500.gif
```


**Image file containing the text image 480x320**
```html
http://localhost:<port>/480x320.jpg?text=image 480x320
```

**White text and a red background**
```html
http://localhost:<port>/480x320?color=FB1006&textColor=FFF&text=white on red
```

## URL Options

**Size**
- width
- Height - The desired image height. If left off, the resulting image will be square: {width} x {width}.

**File formats**
- .png (default)
- .jpg
- .gif

**Query params** - Further options can be specified here:
- color - must be a hex value without the `#`. Default is 'ccc'.
- textColor - must be a hex value without the `#`. Default is '000'.
- text - The text to display. Default is '{width} x {height}'.
