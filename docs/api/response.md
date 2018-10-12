<a name="Response"></a>

## Response
Response

A Response box encapsulates data that is potentially asynchronous. It has three instances: Ready, Loading, and Error.
If the Response is Ready <value>, it can be operated on normally. Both of the other instances are passed over, the only difference
between the two that the Error instance can contain data. Attempting to perform any operation on either of these non-Ready instances
results in the original value being returned.

**Kind**: global class  
<a name="Response+toString"></a>

### response.toString() ⇒ <code>string</code>
Overrides the toString() of the prototype to make logging of Response boxes
more user friendly

**Kind**: instance method of [<code>Response</code>](#Response)  
