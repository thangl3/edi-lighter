# edi-lighter

## Why you should you it for display EDI data

Because it helps you highlight and you can custom your color, so make you have visibility when looking at your data.

## How to use this simple library

You need to create a holder element contain the result.

```html
<body>
	<div id="view-edi"></div>
</body>
```

And in script tag call to method `ediLighter` to use.

```js
const holderElement = document.querySelector('#view-edi');
const ediData = 'it can be get from ajax or ... anywhere';

// lineNumber is true this mean you want to show the line number in the left of holder
ediLighter(holderElement, ediData, { lineNumber: true });
```

## How to test it

1. After clone and install all dependencies, you run command `npm run dev`
2. The browser will opens link `localhost:3000`, click on link with prefix `.html`
3. See you document formatted.
