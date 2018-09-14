# Maybe

A maybe represents a value that can be nullable. It can either be `Just` or `Nothing` -- where `Just <any>` represents a value that exists,
and `Nothing` represents one that does not.

## Creating a Maybe

_From Scratch_

```js
// Just 3
const aValue = Maybe.Just(3);

// Nothing
const nothing = Maybe.Nothing();
```

_From Native Values_

```js
// From something that may not be defined
const maybeSomething = Maybe.from(someValue); // Might be Nothing if someValue is undefined or null

// From null, allowing undefined as a valid value
const maybeNull = Maybe.fromNullable(someValue);

// From undefined, allowing null as a valid value
const maybeUndefined = Maybe.fromUndefined(someValue);

// From things that are not truthy
const maybeTruthy = Maybe.fromTruthy(someValue);
```

_From Other Monads_

```js
// From an Either (Left becomes Nothing)
const maybeSomething = Maybe.fromEither(eitherSomething);

// From a Response (Both Error and Loading become Nothing)
const maybeSomething = Maybe.fromResponse(someResponse);
```

## Turning a Maybe into something else

Sometimes you'll have a Maybe, but what you'll really want is something with more control

```js
// To an Either
const eitherSomething = maybeSomething.toEither('The Left Value')

// To a Response, preferring Loading if the Maybe value is Nothing
const someResponse = maybeSomething.toLoadingResponse();

// To a Response, preferring Error with some value if the Maybe value is Nothing
const someResponse = maybeSomething.toErrorResponse('The Error Value');
```

## Acting on Maybe

Maybe's behavior is to invoke function calls through when it's the Just instance, otherwise function execution
is completely ignored and Nothing is passed-through.

```js
// Applying a function to a held value
Maybe.Just(3).fmap(n => n + 1); // Just 4
Maybe.Nothing().fmap(n => n + 1); // Nothing

// Applying a value to a held function
Maybe.Just(n => n + 1).ap(Maybe.Just(3)); // Just 4
Maybe.Just(n => n + 1).ap(Maybe.Nothing()); // Nothing
Maybe.Nothing().ap(Maybe.Just(3)); // Nothing

// Applying a function that returns a maybe
const maybeAddOne = n => Maybe.Just(n + 1);
const maybeDoNothing = _ => Maybe.Nothing();

Maybe.Just(3).chain(maybeAddOne); // Just 4
Maybe.Just(3).chain(maybeDoNothing); // Nothing
Maybe.Nothing().chain(maybeAddOne); // Nothing
```

## Getting Values out of Maybe

```js
// Safely, with Pattern Matching
maybeSomeValue.caseOf({
    just: (v) => ...
    nothing: () => ...
});

// Safely, with a default value
maybeSomeValue.withDefault(42); // someValue, or 42 if maybeSomeValue is Nothing

// Unsafely, with extract
maybeSomeValue.extract(); // someValue, or a thrown error if maybeSomeValue is Nothing
```
