# web-recorder
> Frontend JS recorder for Keyize

# Usage

First, you must embed the recorder script into the page.

```js
// Create an instance
const myRec = new Recorder()

// Bind to an element, eg. textarea / input type="text"
myRec.track(document.querySelector("#myinput"))

// Later, export the recording
myRec.exportV1()
// => string recording in Keyize V1 format

// If you would like, reset the recording
myRec.reset()
```

# Build

1. Clone repository.

2. Install dependencies

```sh
npm i --save-dev
```

3. Build

```sh
npm run build
```

This will output the final JS file to the lib directory.
