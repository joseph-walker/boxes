<a name="Maybe"></a>

## Maybe
Maybe

A Maybe box encapsulates data that could potentially be null, undefined, or otherwise not exist. It has two instances: Just, and Nothing.
If a Maybe is Just <value>, then that means that value exists and can be used. If it's Nothing, then you can't do anything with it.
Attempting to perform an operation on a Nothing will result in Nothing being returned.

**Kind**: global class  

* [Maybe](#Maybe)
    * _instance_
        * [.toString()](#Maybe+toString) ⇒ <code>string</code>
        * [.toEither(leftValue)](#Maybe+toEither) ⇒ <code>Either</code>
        * [.toLoadingResponse()](#Maybe+toLoadingResponse) ⇒ <code>Response</code>
        * [.toErrorResponse(err)](#Maybe+toErrorResponse) ⇒ <code>Response</code>
        * [.isJust()](#Maybe+isJust) ⇒ <code>boolean</code>
        * [.isNothing()](#Maybe+isNothing) ⇒ <code>boolean</code>
        * [.withDefault(defaultValue)](#Maybe+withDefault) ⇒ <code>any</code>
        * [.extractUnsafe()](#Maybe+extractUnsafe) ⇒ <code>any</code>
        * [.fmap(fn)](#Maybe+fmap) ⇒ [<code>Maybe</code>](#Maybe)
        * [.ap(x)](#Maybe+ap) ⇒ [<code>Maybe</code>](#Maybe)
        * [.chain(fn)](#Maybe+chain) ⇒ [<code>Maybe</code>](#Maybe)
        * [.caseOf(patterns)](#Maybe+caseOf) ⇒ <code>any</code>
    * _static_
        * [.Just(value)](#Maybe.Just) ⇒ [<code>Maybe</code>](#Maybe)
        * [.Nothing()](#Maybe.Nothing) ⇒ [<code>Maybe</code>](#Maybe)
        * [.from(value)](#Maybe.from) ⇒ [<code>Maybe</code>](#Maybe)
        * [.fromNullable(value)](#Maybe.fromNullable) ⇒ [<code>Maybe</code>](#Maybe)
        * [.fromUndefined(value)](#Maybe.fromUndefined) ⇒ [<code>Maybe</code>](#Maybe)
        * [.fromTruthy(value)](#Maybe.fromTruthy) ⇒ [<code>Maybe</code>](#Maybe)
        * [.fromEither(either)](#Maybe.fromEither) ⇒ [<code>Maybe</code>](#Maybe)
        * [.fromResponse(response)](#Maybe.fromResponse) ⇒ [<code>Maybe</code>](#Maybe)
        * [.lift2(fn)](#Maybe.lift2) ⇒ <code>function</code>
        * [.lift3(fn)](#Maybe.lift3) ⇒ <code>function</code>
        * [.lift4(fn)](#Maybe.lift4) ⇒ <code>function</code>
        * [.lift5(fn)](#Maybe.lift5) ⇒ <code>function</code>
        * [.lift6(fn)](#Maybe.lift6) ⇒ <code>function</code>
        * [.traverse(fn, xs)](#Maybe.traverse) ⇒ [<code>Maybe</code>](#Maybe)
        * [.sequence(xs)](#Maybe.sequence) ⇒ [<code>Maybe</code>](#Maybe)

<a name="Maybe+toString"></a>

### maybe.toString() ⇒ <code>string</code>
Overrides the toString() of the prototype to make logging of Maybe boxes
more user friendly

**Kind**: instance method of [<code>Maybe</code>](#Maybe)  
<a name="Maybe+toEither"></a>

### maybe.toEither(leftValue) ⇒ <code>Either</code>
Creates a new Either by up-converting a Maybe
If the Maybe is Just <value>, will return Right <value>
Otherwise, use the value passed as an argument to create a Left <leftValue>

**Kind**: instance method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| leftValue | <code>any</code> | The value to use as Either Left if the Maybe is Nothing |

<a name="Maybe+toLoadingResponse"></a>

### maybe.toLoadingResponse() ⇒ <code>Response</code>
Creates a new Response by up-converting a Maybe
If the Maybe is Just <value>, will return Ready <value>
Otherwise, will return Response Loading. If you want to create an Error Response instead,
use Maybe.toErrorResponse()

**Kind**: instance method of [<code>Maybe</code>](#Maybe)  
<a name="Maybe+toErrorResponse"></a>

### maybe.toErrorResponse(err) ⇒ <code>Response</code>
Creates a new Response by up-converting a Maybe
If the Maybe is Just <value>, will return Ready <value>
Otherwise, will return Error <err> with the value passed as an agument.
If you want to create a Loading Response instead, use Maybe.toErrorResponse()

**Kind**: instance method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>any</code> | The value to use as Response Error if the Maybe is Nothing |

<a name="Maybe+isJust"></a>

### maybe.isJust() ⇒ <code>boolean</code>
Returns true if this Maybe is Just <value>, otherwise returns false

**Kind**: instance method of [<code>Maybe</code>](#Maybe)  
<a name="Maybe+isNothing"></a>

### maybe.isNothing() ⇒ <code>boolean</code>
Returns true if this Maybe is Nothing, otherwise returns false

**Kind**: instance method of [<code>Maybe</code>](#Maybe)  
<a name="Maybe+withDefault"></a>

### maybe.withDefault(defaultValue) ⇒ <code>any</code>
Attempt to extract the value held in a Just instance, defaulting to returning
defaultValue if the Maybe is Nothing

**Kind**: instance method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| defaultValue | <code>any</code> | What to use if the Maybe is Nothing |

<a name="Maybe+extractUnsafe"></a>

### maybe.extractUnsafe() ⇒ <code>any</code>
Unwrap the Maybe in an unsafe way
If the Maybe is Nothing, an exception is thrown
Otherwise the value contained in the Just is returned

**Kind**: instance method of [<code>Maybe</code>](#Maybe)  
<a name="Maybe+fmap"></a>

### maybe.fmap(fn) ⇒ [<code>Maybe</code>](#Maybe)
Operate on the value contained in a Maybe Box
If the Maybe is Just <value>, the returned values will be Just <fn(value)>
Otherwise, it will be Nothing

**Kind**: instance method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The function to call on the contained value |

<a name="Maybe+ap"></a>

### maybe.ap(x) ⇒ [<code>Maybe</code>](#Maybe)
Invoke a function held within a Maybe Box
If the Maybe is Just <fn> and x is Just <x>, the returned value will be Just <fn(x)>
If either the Maybe you call ap on or the Maybe passed in as an argument are Nothing, Nothing will be returned

**Kind**: instance method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| x | [<code>Maybe</code>](#Maybe) | The Maybe to pass as an argument to your Maybe function |

<a name="Maybe+chain"></a>

### maybe.chain(fn) ⇒ [<code>Maybe</code>](#Maybe)
Invoke a function on a contained value, then flatten the result
chain is similar to fmap, but is intended to work with functions that themselves return Maybes
If the Maybe is Just <x> and the function returns Just <y>, chain will return Just <y>
If the function returns Nothing, chain will return Nothing
If the Maybe is Nothing, chain will return Nothing

**Kind**: instance method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The function to apply to the contained value. Must return a Maybe. |

<a name="Maybe+caseOf"></a>

### maybe.caseOf(patterns) ⇒ <code>any</code>
Extract a Maybe by explicitly accounting for every possible instance
Expects an object with a just and nothing property whose values are functions that will
receive the unwrapped Maybe value.

**Kind**: instance method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| patterns | <code>object</code> | An object with a shape of { just: (x) => ..., nothing: () => ... } |

<a name="Maybe.Just"></a>

### Maybe.Just(value) ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Just instance of the Maybe box
Just operates transparently, and will pass through the value held.

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to put into the Maybe |

<a name="Maybe.Nothing"></a>

### Maybe.Nothing() ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Nothing instance of the Maybe box
Nothing skips execution, and any operation on a Nothing will return Nothing.

**Kind**: static method of [<code>Maybe</code>](#Maybe)  
<a name="Maybe.from"></a>

### Maybe.from(value) ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Maybe based on the value given
Will be Nothing if the value is null or undefined (strict equality), otherwise it will be Just <value>

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to put into the Maybe |

<a name="Maybe.fromNullable"></a>

### Maybe.fromNullable(value) ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Maybe based on the value given
Will be Nothing if the value is null (strict equality), otherwise it will be Just <value>
Allows undefined to pass through as a valid value

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to put into the Maybe |

<a name="Maybe.fromUndefined"></a>

### Maybe.fromUndefined(value) ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Maybe based on the value given
Will be Nothing if the value is undefined (strict equality), otherwise it will be Just <value>
Allows null to pass through as a valid value

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to put into the Maybe |

<a name="Maybe.fromTruthy"></a>

### Maybe.fromTruthy(value) ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Maybe based on the value given
Will be Nothing if the value is falsey, or Just <value> if the value is truthy

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to put into the Maybe |

<a name="Maybe.fromEither"></a>

### Maybe.fromEither(either) ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Maybe by down-converting an Either
Will be Just <right> if the Either is Right and Nothing if the value is Left
By using this conversion, you lose information about the Left value of the Either

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| either | <code>Either</code> | The Either to turn into a Maybe |

<a name="Maybe.fromResponse"></a>

### Maybe.fromResponse(response) ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Maybe by down-converting a Response
Will be Just <ready> if the Response is Ready and Nothing if the value is Loading or Error
By using this conversion, you lose information about the Error value of the Response

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| response | <code>Response</code> | The Response to turn into a Maybe |

<a name="Maybe.lift2"></a>

### Maybe.lift2(fn) ⇒ <code>function</code>
Lift a function with Arity 2 into the Maybe box.
This new function will accept 2 arguments that must be wrapped in Maybe, and will return
a Maybe that is the result of unwrapping the arguments and executing the function.
Will return Nothing if either argument is Nothing.

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The function to lift into the Maybe box. Must have 2 arguments. |

<a name="Maybe.lift3"></a>

### Maybe.lift3(fn) ⇒ <code>function</code>
Lift a function with Arity 3 into the Maybe box.
This new function will accept 3 arguments that must be wrapped in Maybe, and will return
a Maybe that is the result of unwrapping the arguments and executing the function.
Will return Nothing if any argument is Nothing.

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The function to lift into the Maybe box. Must have 3 arguments. |

<a name="Maybe.lift4"></a>

### Maybe.lift4(fn) ⇒ <code>function</code>
Lift a function with Arity 4 into the Maybe box.
This new function will accept 4 arguments that must be wrapped in Maybe, and will return
a Maybe that is the result of unwrapping the arguments and executing the function.
Will return Nothing if any argument is Nothing.

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The function to lift into the Maybe box. Must have 4 arguments. |

<a name="Maybe.lift5"></a>

### Maybe.lift5(fn) ⇒ <code>function</code>
Lift a function with Arity 5 into the Maybe box.
This new function will accept 5 arguments that must be wrapped in Maybe, and will return
a Maybe that is the result of unwrapping the arguments and executing the function.
Will return Nothing if any argument is Nothing.

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The function to lift into the Maybe box. Must have 5 arguments. |

<a name="Maybe.lift6"></a>

### Maybe.lift6(fn) ⇒ <code>function</code>
Lift a function with Arity 6 into the Maybe box.
This new function will accept 6 arguments that must be wrapped in Maybe, and will return
a Maybe that is the result of unwrapping the arguments and executing the function.
Will return Nothing if any argument is Nothing.

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | The function to lift into the Maybe box. Must have 6 arguments. |

<a name="Maybe.traverse"></a>

### Maybe.traverse(fn, xs) ⇒ [<code>Maybe</code>](#Maybe)
Given some function that returns a Maybe, map over a list of values and execute
the function on each value using an array-style map. Then, flatten the result into a
Maybe. If any element of the resulting list is Nothing, this entire operation is Nothing.
Otherwise, it will be a Just <array>

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| fn | <code>function</code> | Function to map over list with. Must return Maybe. |
| xs | <code>array</code> | List to iterate over |

<a name="Maybe.sequence"></a>

### Maybe.sequence(xs) ⇒ [<code>Maybe</code>](#Maybe)
Take an array of Maybes and flatten it into a single Maybe containing an array.
If any element of the list is Nothing, this entire operation is Nothing. Otherwise,
it will be Just <array>

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| xs | <code>array</code> | List of Maybes to flatten. |

