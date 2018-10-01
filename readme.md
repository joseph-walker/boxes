![Boxes JS](./boxesLogo.png)

# Put Your Data in a Box

[![Build Status](https://travis-ci.org/joseph-walker/boxes.svg?branch=master)](https://travis-ci.org/joseph-walker/boxes)

Boxes.js is a Javascript library that attempts to make handling janky data simpler, safer, and less infuriating.
How many times have you forgotten to make a null check for optional data? How many times have you put a "loading" semaphore in your
model to mark when an async call was complete? How many ternaries have you written to handle error messages when data is missing?

If you're thinking to yourself right now "Hey, that sounds familiar," Boxes might be for you.

### Table of Contents

- [⬇️ Installing](#installing)
- [🕑 Quick Start](#quick-start)
- [📦 The Boxes](#the-boxes)
- [📘 Cookbook](./docs/cookbook.md)
- [🤔 FAQs](./docs/faqs.md)

## Installing

npm
```
npm install --save boxes.js
```

yarn
```
yarn add boxes.js
```

## Quick Start

__Zero to Sixty, let's go.__ 🔥

Import a Box. Let's use Maybe.
```js
import { Maybe } from 'boxes.js';
```

Get you some data.
```js
const myData = 'Hello World';
```

Put it in a box.
```js
const myBox = Maybe.Just(myData);
```

Let's do stuff to it.
```js
const lowercase = myBox.fmap(s => s.toLowerCase());
```

What do we have?
```js
console.log(lowercase); // Just (hello world)
```

Let's make another box. An empty one this time.
```js
const myEmptyBox = Maybe.Nothing();
```

Let's do the same thing.
```js
const lowercaseAgain = myEmptyBox.fmap(s => s.toLowerCase());
```

But wait, there's no data. It's null! You can't call toLowerCase() on null!
```js
// But there's no error
```

Well then what do we have now?
```js
console.log(lowercaseAgain); // Nothing
```

What we started with -- nothing! Our function was never actually called.

## The Boxes

### Maybe

The Maybe box encapsulates data that may not exist. When you put your data in a Maybe,
you can tell Maybe what you want to do to your data and let Maybe handle wether or not that data actually exists.
You can think of it as abstracting away the null check.

- [Maybe Overview](./docs/maybe.md)
- [Maybe API Reference](./docs/api/maybe.md)

### Either

The Either box encapsulates data that might exist in a binary state. For example, a common use of Either is for encoding
a piece of data that might exist, but if it doesn't, then it would encode some sort of error message or
maybe some fallback value. You can think of it as abstracting away ternary operators, or as a more powerful version of Maybe.

- [Either Overview](./docs/either.md)
- [Either API Reference](./docs/api/either.md)

### Response

The Response box encapsulates data that might typically come from an API, where it may either be loading or potentially errored out.
When your data is in a Response, you can operate on your data as if it were already available even if your data is coming from
an asynchronous source. You can think of it as abstracting away async ready state checks -- but note that this is
NOT a replacement for Promises (though it's a great pairing if you use them together. More on that in the Response Overview.)

- [Response Overview](./docs/response.md)
- [Response API Reference](./docs/api/response.md)
