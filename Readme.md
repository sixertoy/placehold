# Dummies images server generator

## Requirements

Libraries required to run placeholder server

```bash
brew install graphicsmagick
brew install ghostscript
```

## Install

Install module via NPM command line

```bash
npm install -g https://github.com/sixertoy/placehold.git
```

## Usages

### Serving dummy image file

> placehold needs to have a port to listen to
> you can set this value by:

- a command line argument
- settings a property in your project's package.json file
- define a variable in a .env file `project > home > module directories`

##### Set port using command line option

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
PLACEHOLD_PORT=9999
```

```bash
cd <my_project>
placehold
```

### Images Options

#### Size (required)

`width` is the only one options required
If `height` options is left off, the resulting image will be square: `{width x width}`.

#### Optionnals query params

**Intext image**

> Use `text` in a query params string to set an intext image
> Default text value is image's size `{width x height}`

**Text color**

> Text color, a hex value without the `#`, default value is set to 'CCC'

- Background color

- File formats
  - `.png` (default)
  - `.jpg`
  - `.gif`

## Examples

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

- Further options can be specified here:
- color - .
- textColor - must be a hex value without the `#`. Default is '000'.
- text - The text to display. Default is '{width} x {height}'.
