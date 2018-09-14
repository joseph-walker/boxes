import { Monad } from 'algebra/typeclass';
import { isLinearFunction } from 'guard/isLinearFunction';
import { Either } from 'algebra/either';
import { Response } from 'algebra/response';

enum MaybeType {
	Just = 'MAYBE_JUST',
	Nothing = 'MAYBE_NOTHING'
}

export interface MaybePatternMatch<T, U> {
	just: (x: T) => U,
	nothing: () => U
}

export class Maybe<T> implements Monad<T> {
	private constructor (readonly type: MaybeType, readonly value: T) {
		//
	}

	public static Just<T>(value: T): Maybe<T> {
		return new Maybe(MaybeType.Just, value);
	}

	public static Nothing<T>(): Maybe<T> {
		return new Maybe(MaybeType.Nothing, null);
	}

	public static pure<T>(x: T): Maybe<T> {
		return Maybe.Just(x);
	}

	public static from<T>(value: T | undefined | null): Maybe<T> {
		if (value !== undefined && value !== null)
			return Maybe.Just(value);

		return Maybe.Nothing();
	}

	public static fromNullable<T>(value: T | null): Maybe<T> {
		if (value !== null)
			return Maybe.Just(value);

		return Maybe.Nothing();
	}

	public static fromUndefined<T>(value: T | undefined): Maybe<T> {
		if (value !== undefined)
			return Maybe.Just(value);

		return Maybe.Nothing();
	}

	public static fromTruthy<T>(value: T): Maybe<T> {
		if (value)
			return Maybe.Just(value);

		return Maybe.Nothing();
	}

	public static fromEither<T>(either: Either<any, T>): Maybe<T> {
		return either.caseOf({
			left: l => Maybe.Nothing() as Maybe<T>,
			right: r => Maybe.Just(r)
		});
	}

	public static fromResponse<T>(response: Response<any, T>): Maybe<T> {
		return response.caseOf({
			loading: () => Maybe.Nothing() as Maybe<T>,
			error: e => Maybe.Nothing() as Maybe<T>,
			ready: d => Maybe.Just(d)
		});
	}

	public toEither<U>(leftValue: U): Either<U, T> {
		if (this.isJust())
			return Either.Right(this.value);

		return Either.Left(leftValue);
	}

	public toLoadingResponse(): Response<any, T> {
		if (this.isJust())
			return Response.Ready(this.value);

		return Response.Loading();
	}

	public toErrorResponse<E>(err: E): Response<E, T> {
		if (this.isJust())
			return Response.Ready(this.value);

		return Response.Error(err);
	}

	public isJust() {
		return this.type === MaybeType.Just;
	}

	public isNothing() {
		return this.type === MaybeType.Nothing;
	}

	public withDefault(defaultValue: T): T {
		if (this.isJust())
			return this.value;

		return defaultValue;
	}

	public extractUnsafe() {
		if (this.isJust())
			return this.value;

		throw new Error(`Type Constraint Failure: Tried to extract Just value from Nothing instance`);
	}

	public fmap<U>(fn: (x: T) => U): Maybe<U> {
		if (this.isJust())
			return Maybe.Just(fn(this.value));

		return Maybe.Nothing();
	}

	public ap<U, V>(x: Maybe<U>): Maybe<V> {
		if (this.isJust() && x.isJust()) {
			if (isLinearFunction<U, V>(this.value)) {
				const fn = this.value;

				return Maybe.Just(fn(x.value));
			}
			else {
				throw new Error(`Type Constraint Failure: Expected ${this.value} to be function, got ${typeof this.value}`);
			}
		}

		return Maybe.Nothing();
	}

	public chain<U>(fn: (x: T) => Maybe<U>): Maybe<U> {
		if (this.isJust())
			return fn(this.value);

		return Maybe.Nothing();
	}

	public caseOf<U>(patterns: MaybePatternMatch<T, U>): U {
		if (this.isJust())
			return patterns.just(this.value);

		return patterns.nothing();
	}
}
