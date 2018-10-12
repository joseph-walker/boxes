<a name="Either"></a>

## Either
Either

An Either box encapsulates data that could potentially be one of two different values. It has two instances: Left and Right.
Operating on an Either will generally only proceed if the instance is Right <value>. In most cases, Left <value> will be skipped over unless
you explicitly fmapLeft() the Either. For a more thorough explanation, take a look at the Either overview in the documentation.

A word on naming: Even though you'll mostly see Either types representing potential errors and it can help to think of "Left" as an
"Error" instance, an Either doesn't explicitly have to be an error. It can simply be an alternative. However, a helpful mnemonic you can use to
remember the "preferred" value in an either is "Right is right, Left is wrong."

**Kind**: global class  
<a name="Either+toString"></a>

### either.toString() ⇒ <code>string</code>
Overrides the toString() of the prototype to make logging of Either boxes
more user friendly

**Kind**: instance method of [<code>Either</code>](#Either)  
