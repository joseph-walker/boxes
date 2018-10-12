import { Monad } from 'algebra/typeclass';
import { isLinearFunction } from 'guard/isLinearFunction';

enum ResponseType {
	Loading = 'RESPONSE_LOADING',
	Ready = 'RESPONSE_READY',
	Error = 'RESPONSE_ERROR'
}

export interface ResponsePatternMatch<E, T, U> {
	loading: () => U,
	ready: (x: T) => U,
	error: (e: E) => U
}

/**
 * @class Response
 *
 * A Response box encapsulates data that is potentially asynchronous. It has three instances: Ready, Loading, and Error.
 * If the Response is Ready <value>, it can be operated on normally. Both of the other instances are passed over, the only difference
 * between the two that the Error instance can contain data. Attempting to perform any operation on either of these non-Ready instances
 * results in the original value being returned.
 */
export class Response<E, T> implements Monad<T> {
	constructor(readonly type: ResponseType, readonly value: T, readonly err: E) {
		//
	}

	/**
	 * Overrides the toString() of the prototype to make logging of Response boxes
	 * more user friendly
	 *
	 * @return {string}
	 */
	public toString(): string {
		if (this.isReady())
			return `Ready (${this.value.toString()})`;
		else if (this.isError())
			return `Error (${this.err.toString()})`;

		return `Loading`;
	}

	public static Loading(): Response<any, any> {
		return new Response(ResponseType.Loading, null, null);
	}

	public static Ready<T>(value: T): Response<any, T> {
		return new Response(ResponseType.Ready, value, null);
	}

	public static Error<E>(err: E): Response<E, any> {
		return new Response(ResponseType.Error, null, err);
	}

	public static pure<E, T>(x: T): Response<E, T> {
		return Response.Ready(x);
	}

	public isLoading() {
		return this.type === ResponseType.Loading;
	}

	public isReady() {
		return this.type === ResponseType.Ready;
	}

	public isError() {
		return this.type === ResponseType.Error;
	}

	public fmap<U>(fn: (x: T) => U): Response<E, U> {
		if (this.isReady())
			return Response.Ready(fn(this.value));
		else if (this.isError())
			return Response.Error(this.err);

		return Response.Loading();
	}

	public fmapError<U>(fn: (x: E) => U): Response<U, T> {
		if (this.isError())
			return Response.Error(fn(this.err));
		else if (this.isReady())
			return Response.Ready(this.value);

		return Response.Loading();
	}

	public ap<U, V>(x: Response<E, U>): Response<E, V> {
		if (this.isReady() && x.isReady()) {
			if (isLinearFunction<U, V>(this.value)) {
				const fn = this.value;

				return Response.Ready(fn(x.value));
			}
			else
				throw new Error(`Type Constraint Failure: Expected ${this.value} to be function, got ${typeof this.value}`);
		}
		else if (this.isError())
			return Response.Error(this.err);
		else if (this.isLoading())
			return Response.Loading();
		else if (x.isError())
			return Response.Error(x.err);

		return Response.Loading();
	}

	public chain<U>(fn: (x: T) => Response<E, U>): Response<E, U> {
		if (this.isReady())
			return fn(this.value);
		else if (this.isError())
			return Response.Error(this.err);

		return Response.Loading();
	}

	public caseOf<U>(patterns: ResponsePatternMatch<E, T, U>): U {
		if (this.isReady())
			return patterns.ready(this.value);
		else if (this.isError())
			return patterns.error(this.err);

		return patterns.loading();
	}
}
