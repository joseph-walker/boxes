# Cookbook

The following are some typical use cases for Boxes. The examples will use Maybe since it's the simplest, but
it's important to realize that every example could operate with Either or Response with no code changes required.

## Write your functions like you have all your data, even if you don't

```js
function doSomethingWithNullable(theValue) {
    return theValue + ...;
}

// Let Maybe do the heavy lifting of null-checking
Maybe.Nothing().fmap(doSomethingWithNullable);
```

## Use Maybe in Typescript for React Props that are optional

Using Maybe's for optional types not only eliminates having to perform null checks, it gives you an added layer of type
safety because the only way to extract a Maybe value is to explicitly account for the `Nothing` case.

```ts
interface OwnProps {
    someOptionalProp: Maybe<string>
}

export default myComponent extends React.Component<OwnProps> {
    ...
}
```

## Boxes work particularly well with pipelines

```js
function doSomethingStep1(theValue) {
    return someDatabaseCall(theValue) ? Maybe.Just('bar') : Maybe.Nothing();
}

function doSomethingStep2(theValue) {
    return someApiResult(theValue) ? Maybe.Just('foo') : Maybe.Nothing();
}

function doSomethingStep3(theValue) {
    return theValue - ...;
}

// If at any point one of these steps results in Nothing,
// Nothing falls through and execution is ignored
doSomethingStep1(3)
    .chain(doSomethingStep2)
    .fmap(doSomethingStep3);
```

## You can use Lifting to handle aggregating data into a single function call

For example, let's say you had 3 sources of data that might all be nullable
(or maybe they're async and stored in Responses, the princple still applies).
You can write a single operative function with 3 arguments and just pretend like you have all your data,
then use Lifting to easily gain the benefits of your Box of choice:

```js
function doStuffWithThreeNullables(a, b, c) {
    return a + b + c;
}

// If any of these three arguments are Nothing, result is Nothing. Otherwise, result is Just 6
// It's important to note that in the Nothing case, the function is actually not even executed.
const result = Maybe.liftA3(doStuffWithThreeNullables)(maybeOne, maybeTwo, maybeThree);
```

There are Lifts all the way up to 6 arguments. If you need more, you can use `ap` chaining
(though your function will need to be [curried](https://stackoverflow.com/questions/36314/what-is-currying) -- if you use liftA#, this happens automatically)

```js
function doStuffWithWayTooMuchData(a, b, c, d, e, f, g) {
    return ...;
}

// Under the hood, this is what liftA# is doing -- they're just convenient helpers
const result = Maybe.Just(curry(doStuffWithWayTooMuchData))
    .ap(maybeA)
    .ap(maybeB)
    .ap(maybeC)
    .ap(maybeD)
    .ap(maybeE)
    .ap(maybeF)
    .ap(maybeG);
```

## You can transform arrays of Boxes into Boxes of arrays

This is similar to Promise.all if you're familiar (in fact, Promise IS a Box. You've been using them all along!)

```js
Maybe.sequence([Maybe.Just(3), Maybe.Just(4), Maybe.Just(5)]); // Just [3, 4, 5]
Maybe.sequence([Maybe.Just(3), Maybe.Nothing()]); // Nothing
```

By utilizing function argument splatting, you can use this as an alternative to Lifting or `ap` Chaining if that's
your jam.

## Nest your Boxes for even finer-grain control

You can put anything into your Boxes, even other Boxes. For example, say you had an API call that returned a nullable value:

```js
function someApiCall() {
    if (xhr.status === 'ok') {
        if (body.content === 'nada') {
            // The request succeeded, but there's nothing here!
            return Response.Ready(Maybe.Nothing());
        } else {
            return Response.Ready(Maybe.Just('foo'));
        }
    }
}
```
