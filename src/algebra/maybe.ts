import { Monad } from 'algebra/typeclass';
import { Either } from 'algebra/either';
import { Response } from 'algebra/response';
import { isLinearFunction } from 'guard/isLinearFunction';
import * as Applicative from 'lib/applicative';

enum MaybeType {
	Just = 'MAYBE_JUST',
	Nothing = 'MAYBE_NOTHING'
}

export interface MaybePatternMatch<T, U> {
	just: (x: T) => U,
	nothing: () => U
}

/**
 * @class Maybe
 *
 * A Maybe box encapsulates data that could potentially be null, undefined, or otherwise not exist. It has two instances: Just, and Nothing.
 * If a Maybe is Just <value>, then that means that value exists and can be used. If it's Nothing, then you can't do anything with it.
 * Attempting to perform an operation on a Nothing will result in Nothing being returned.
 */
export class Maybe<T> implements Monad<T> {
	private constructor (readonly type: MaybeType, readonly value: T) {
		//
	}

	public toString(): string {
		if (this.isJust())
			return `Just (${this.value.toString()})`;

		return `Nothing`;
	}

	/**
	 * Creates a new Just instance of the Maybe box
	 * Just operates transparently, and will pass through the value held.
	 *
	 * @param {any} value - The value to put into the Maybe
	 * @return {Maybe}
	 */
	public static Just<T>(value: T): Maybe<T> {
		return new Maybe(MaybeType.Just, value);
	}

	/**
	 * Creates a new Nothing instance of the Maybe box
	 * Nothing skips execution, and any operation on a Nothing will return Nothing.
	 *
	 * @return {Maybe}
	 */
	public static Nothing<T>(): Maybe<T> {
		return new Maybe(MaybeType.Nothing, null);
	}

	/**
	 * Creates a new Maybe based on the value given
	 * Will be Nothing if the value is null or undefined (strict equality), otherwise it will be Just <value>
	 *
	 * @param {any} value - The value to put into the Maybe
	 * @return {Maybe}
	 */
	public static from<T>(value: T | undefined | null): Maybe<T> {
		if (value !== undefined && value !== null)
			return Maybe.Just(value);

		return Maybe.Nothing();
	}

	/**
	 * Creates a new Maybe based on the value given
	 * Will be Nothing if the value is null (strict equality), otherwise it will be Just <value>
	 * Allows undefined to pass through as a valid value
	 *
	 * @param {any} value - The value to put into the Maybe
	 * @return {Maybe}
	 */
	public static fromNullable<T>(value: T | null): Maybe<T> {
		if (value !== null)
			return Maybe.Just(value);

		return Maybe.Nothing();
	}

	/**
	 * Creates a new Maybe based on the value given
	 * Will be Nothing if the value is undefined (strict equality), otherwise it will be Just <value>
	 * Allows null to pass through as a valid value
	 *
	 * @param {any} value - The value to put into the Maybe
	 * @return {Maybe}
	 */
	public static fromUndefined<T>(value: T | undefined): Maybe<T> {
		if (value !== undefined)
			return Maybe.Just(value);

		return Maybe.Nothing();
	}

	/**
	 * Creates a new Maybe based on the value given
	 * Will be Nothing if the value is falsey, or Just <value> if the value is truthy
	 *
	 * @param {any} value - The value to put into the Maybe
	 * @return {Maybe}
	 */
	public static fromTruthy<T>(value: T): Maybe<T> {
		if (value)
			return Maybe.Just(value);

		return Maybe.Nothing();
	}

	/**
	 * Creates a new Maybe by down-converting an Either
	 * Will be Just <right> if the Either is Right and Nothing if the value is Left
	 * By using this conversion, you lose information about the Left value of the Either
	 *
	 * @param {Either} either - The Either to turn into a Maybe
	 * @return {Maybe}
	 */
	public static fromEither<T>(either: Either<any, T>): Maybe<T> {
		return either.caseOf({
			left: l => Maybe.Nothing() as Maybe<T>,
			right: r => Maybe.Just(r)
		});
	}

	/**
	 * Creates a new Maybe by down-converting a Response
	 * Will be Just <ready> if the Response is Ready and Nothing if the value is Loading or Error
	 * By using this conversion, you lose information about the Error value of the Response
	 *
	 * @param {Response} response - The Response to turn into a Maybe
	 * @return {Maybe}
	 */
	public static fromResponse<T>(response: Response<any, T>): Maybe<T> {
		return response.caseOf({
			loading: () => Maybe.Nothing() as Maybe<T>,
			error: e => Maybe.Nothing() as Maybe<T>,
			ready: d => Maybe.Just(d)
		});
	}

	/**
	 * Creates a new Either by up-converting a Maybe
	 * If the Maybe is Just <value>, will return Right <value>
	 * Otherwise, use the value passed as an argument to create a Left <leftValue>
	 *
	 * @param {any} leftValue - The value to use as Either Left if the Maybe is Nothing
	 * @return {Either}
	 */
	public toEither<U>(leftValue: U): Either<U, T> {
		if (this.isJust())
			return Either.Right(this.value);

		return Either.Left(leftValue);
	}

	/**
	 * Creates a new Response by up-converting a Maybe
	 * If the Maybe is Just <value>, will return Ready <value>
	 * Otherwise, will return Response Loading. If you want to create an Error Response instead,
	 * use Maybe.toErrorResponse()
	 *
	 * @return {Response}
	 */
	public toLoadingResponse(): Response<any, T> {
		if (this.isJust())
			return Response.Ready(this.value);

		return Response.Loading();
	}

	/**
	 * Creates a new Response by up-converting a Maybe
	 * If the Maybe is Just <value>, will return Ready <value>
	 * Otherwise, will return Error <err> with the value passed as an agument.
	 * If you want to create a Loading Response instead, use Maybe.toErrorResponse()
	 *
	 * @param {any} err - The value to use as Response Error if the Maybe is Nothing
	 * @return {Response}
	 */
	public toErrorResponse<E>(err: E): Response<E, T> {
		if (this.isJust())
			return Response.Ready(this.value);

		return Response.Error(err);
	}

	/**
	 * Returns true if this Maybe is Just <value>, otherwise returns false
	 *
	 * @return {boolean}
	 */
	public isJust() {
		return this.type === MaybeType.Just;
	}

	/**
	 * Returns true if this Maybe is Nothing, otherwise returns false
	 *
	 * @return {boolean}
	 */
	public isNothing() {
		return this.type === MaybeType.Nothing;
	}

	/**
	 * Attempt to extract the value held in a Just instance, defaulting to returning
	 * defaultValue if the Maybe is Nothing
	 *
	 * @param {any} defaultValue - What to use if the Maybe is Nothing
	 * @return {any}
	 */
	public withDefault(defaultValue: T): T {
		if (this.isJust())
			return this.value;

		return defaultValue;
	}

	/**
	 * Unwrap the Maybe in an unsafe way
	 * If the Maybe is Nothing, an exception is thrown
	 * Otherwise the value contained in the Just is returned
	 *
	 * @return {any}
	 */
	public extractUnsafe() {
		if (this.isJust())
			return this.value;

		throw new Error(`Type Constraint Failure: Tried to extract Just value from Nothing instance`);
	}

	/**
	 * Operate on the value contained in a Maybe Box
	 * If the Maybe is Just <value>, the returned values will be Just <fn(value)>
	 * Otherwise, it will be Nothing
	 *
	 * @param {function} fn - The function to call on the contained value
	 * @return {Maybe}
	 */
	public fmap<U>(fn: (x: T) => U): Maybe<U> {
		if (this.isJust())
			return Maybe.Just(fn(this.value));

		return Maybe.Nothing();
	}

	/**
	 * Invoke a function held within a Maybe Box
	 * If the Maybe is Just <fn> and x is Just <x>, the returned value will be Just <fn(x)>
	 * If either the Maybe you call ap on or the Maybe passed in as an argument are Nothing, Nothing will be returned
	 *
	 * @param {Maybe} x - The Maybe to pass as an argument to your Maybe function
	 * @return {Maybe}
	 */
	public ap<U, V>(x: Maybe<U>): Maybe<V> {
		if (this.isJust()) {
			if (isLinearFunction<U, V>(this.value)) {
				return x.fmap(this.value);
			}
			else {
				throw new Error(`Type Constraint Failure: Expected ${this.value} to be function, got ${typeof this.value}`);
			}
		}

		return Maybe.Nothing();
	}

	/**
	 * Invoke a function on a contained value, then flatten the result
	 * chain is similar to fmap, but is intended to work with functions that themselves return Maybes
	 * If the Maybe is Just <x> and the function returns Just <y>, chain will return Just <y>
	 * If the function returns Nothing, chain will return Nothing
	 * If the Maybe is Nothing, chain will return Nothing
	 *
	 * @param {function} fn - The function to apply to the contained value. Must return a Maybe.
	 * @return {Maybe}
	 */
	public chain<U>(fn: (x: T) => Maybe<U>): Maybe<U> {
		if (this.isJust())
			return fn(this.value);

		return Maybe.Nothing();
	}

	/**
	 * Extract a Maybe by explicitly accounting for every possible instance
	 * Expects an object with a just and nothing property whose values are functions that will
	 * receive the unwrapped Maybe value.
	 *
	 * @param {object} patterns - An object with a shape of { just: (x) => ..., nothing: () => ... }
	 * @return {any}
	 */
	public caseOf<U>(patterns: MaybePatternMatch<T, U>): U {
		if (this.isJust())
			return patterns.just(this.value);

		return patterns.nothing();
	}

	/**
	 * Lift a function with Arity 2 into the Maybe box.
	 * This new function will accept 2 arguments that must be wrapped in Maybe, and will return
	 * a Maybe that is the result of unwrapping the arguments and executing the function.
	 * Will return Nothing if either argument is Nothing.
	 *
	 * @param {function} fn - The function to lift into the Maybe box. Must have 2 arguments.
	 * @return {Maybe}
	 */
	public static lift2<T, U, V>(
		fn: (x: T, y: U) => V
	): (
		fT: Maybe<T>,
		fU: Maybe<U>
	) => Maybe<V> {
		return function(fT, fU) {
			return Applicative.liftA2(fn, fT, fU) as Maybe<V>;
		};
	}

	/**
	 * Lift a function with Arity 3 into the Maybe box.
	 * This new function will accept 3 arguments that must be wrapped in Maybe, and will return
	 * a Maybe that is the result of unwrapping the arguments and executing the function.
	 * Will return Nothing if any argument is Nothing.
	 *
	 * @param {function} fn - The function to lift into the Maybe box. Must have 3 arguments.
	 * @return {Maybe}
	 */
	public static lift3<T, U, V, W>(
		fn: (x: T, y: U, z: V) => W
	): (
		fT: Maybe<T>,
		fU: Maybe<U>,
		fV: Maybe<V>
	) => Maybe<W> {
		return function(fT, fU, fV) {
			return Applicative.liftA3(fn, fT, fU, fV) as Maybe<W>;
		};
	}

	/**
	 * Lift a function with Arity 4 into the Maybe box.
	 * This new function will accept 4 arguments that must be wrapped in Maybe, and will return
	 * a Maybe that is the result of unwrapping the arguments and executing the function.
	 * Will return Nothing if any argument is Nothing.
	 *
	 * @param {function} fn - The function to lift into the Maybe box. Must have 4 arguments.
	 * @return {Maybe}
	 */
	public static lift4<T, U, V, W, X>(
		fn: (x: T, y: U, z: V, a: W) => X
	): (
		fT: Maybe<T>,
		fU: Maybe<U>,
		fV: Maybe<V>,
		fW: Maybe<W>
	) => Maybe<X> {
		return function(fT, fU, fV, fW) {
			return Applicative.liftA4(fn, fT, fU, fV, fW) as Maybe<X>;
		}
	}

	/**
	 * Lift a function with Arity 5 into the Maybe box.
	 * This new function will accept 5 arguments that must be wrapped in Maybe, and will return
	 * a Maybe that is the result of unwrapping the arguments and executing the function.
	 * Will return Nothing if any argument is Nothing.
	 *
	 * @param {function} fn - The function to lift into the Maybe box. Must have 5 arguments.
	 * @return {Maybe}
	 */
	public static lift5<T, U, V, W, X, Y>(
		fn: (x: T, y: U, z: V, a: W, b: X) => Y
	): (
		fT: Maybe<T>,
		fU: Maybe<U>,
		fV: Maybe<V>,
		fW: Maybe<W>,
		fX: Maybe<X>
	) => Maybe<Y> {
		return function(fT, fU, fV, fW, fX) {
			return Applicative.liftA5(fn, fT, fU, fV, fW, fX) as Maybe<Y>;
		}
	}

	/**
	 * Lift a function with Arity 6 into the Maybe box.
	 * This new function will accept 6 arguments that must be wrapped in Maybe, and will return
	 * a Maybe that is the result of unwrapping the arguments and executing the function.
	 * Will return Nothing if any argument is Nothing.
	 *
	 * @param {function} fn - The function to lift into the Maybe box. Must have 6 arguments.
	 * @return {Maybe}
	 */
	public static lift6<T, U, V, W, X, Y, Z>(
		fn: (x: T, y: U, z: V, a: W, b: X, c: Y) => Z
	): (
		fT: Maybe<T>,
		fU: Maybe<U>,
		fV: Maybe<V>,
		fW: Maybe<W>,
		fX: Maybe<X>,
		fY: Maybe<Y>
	) => Maybe<Z> {
		return function(fT, fU, fV, fW, fX, fY) {
			return Applicative.liftA6(fn, fT, fU, fV, fW, fX, fY) as Maybe<Z>;
		}
	}

	/**
	 * Given some function that returns a Maybe, map over a list of values and execute
	 * the function on each value using an array-style map. Then, flatten the result into a
	 * Maybe. If any element of the resulting list is Nothing, this entire operation is Nothing.
	 * Otherwise, it will be a Just <array>
	 *
	 * @param {function} fn - Function to map over list with. Must return Maybe.
	 * @param {array} xs - List to iterate over
	 * @return {Maybe}
	 */
	public static traverse<T, U>(fn: (x: T) => Maybe<U>, xs: T[]): Maybe<U[]> {
		return Applicative.traverse(Maybe.Just, fn, xs) as Maybe<U[]>;
	}

	/**
	 * Take an array of Maybes and flatten it into a single Maybe containing an array.
	 * If any element of the list is Nothing, this entire operation is Nothing. Otherwise,
	 * it will be Just <array>
	 *
	 * @param {array} xs - List of Maybes to flatten.
	 * @return {Maybe}
	 */
	public static sequence<T>(xs: Maybe<T>[]): Maybe<T[]> {
		return Applicative.sequenceA(Maybe.Just, xs) as Maybe<T[]>;
	}
}
