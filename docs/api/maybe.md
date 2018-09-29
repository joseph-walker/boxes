<a name="Maybe"></a>

## Maybe
Maybe

A Maybe box encapsulates data that could potentially be null, undefined, or otherwise not exist. It has two instances: Just, and Nothing.
If a Maybe is Just <value>, then that means that value exists and can be used. If it's Nothing, then you can't do anything with it.
Attempting to do anything to a Nothing will result in Nothing being returned, otherwise the Just instance will simple do whatever you tell
it to to the value it holds.

**Kind**: global class  

* [Maybe](#Maybe)
    * [.Just(value)](#Maybe.Just) ⇒ [<code>Maybe</code>](#Maybe)
    * [.Nothing()](#Maybe.Nothing) ⇒ [<code>Maybe</code>](#Maybe)
    * [.from(value)](#Maybe.from) ⇒ [<code>Maybe</code>](#Maybe)
    * [.fromNullable(value)](#Maybe.fromNullable) ⇒ [<code>Maybe</code>](#Maybe)
    * [.fromUndefined(value)](#Maybe.fromUndefined) ⇒ [<code>Maybe</code>](#Maybe)
    * [.fromTruthy(value)](#Maybe.fromTruthy) ⇒ [<code>Maybe</code>](#Maybe)
    * [.fromEither(either)](#Maybe.fromEither) ⇒ [<code>Maybe</code>](#Maybe)
    * [.fromResponse(response)](#Maybe.fromResponse) ⇒ [<code>Maybe</code>](#Maybe)

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
Will be Nothing if the value is null or undefined (strict equality), otherwise it will be Just

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to put into the Maybe |

<a name="Maybe.fromNullable"></a>

### Maybe.fromNullable(value) ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Maybe based on the value given
Will be Nothing if the value is null (strict equality), otherwise it will be Just
Allows undefined to pass through as a valid value

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to put into the Maybe |

<a name="Maybe.fromUndefined"></a>

### Maybe.fromUndefined(value) ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Maybe based on the value given
Will be Nothing if the value is undefined (strict equality), otherwise it will be Just
Allows null to pass through as a valid value

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to put into the Maybe |

<a name="Maybe.fromTruthy"></a>

### Maybe.fromTruthy(value) ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Maybe based on the value given
Will be Nothing if the value is falsey, or Just if the value is truthy

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>any</code> | The value to put into the Maybe |

<a name="Maybe.fromEither"></a>

### Maybe.fromEither(either) ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Maybe by down-converting an Either
Will be Just if the Either is Right and Nothing if the value is Left
By using this conversion, you lose information about the Left value of the Either

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| either | <code>Either</code> | The Either to turn into a Maybe |

<a name="Maybe.fromResponse"></a>

### Maybe.fromResponse(response) ⇒ [<code>Maybe</code>](#Maybe)
Creates a new Maybe by down-converting a Response
Will be Just if the Response is Ready and Nothing if the value is Loading or Error
By using this conversion, you lose information about the Error value of the Response

**Kind**: static method of [<code>Maybe</code>](#Maybe)  

| Param | Type | Description |
| --- | --- | --- |
| response | <code>Response</code> | The Response to turn into a Maybe |

