import { Monad } from './typeclass';
import { isLinearFunction } from '../guard/isLinearFunction';

enum EitherType {
	Left = 'EITHER_LEFT',
	Right = 'EITHER_RIGHT'
}

export interface EitherPatternMatch<L, R, U> {
	left: (l: L) => U,
	right: (r: R) => U
}

/**
 * @class Either
 *
 * An Either box encapsulates data that could potentially be one of two different values. It has two instances: Left and Right.
 * Operating on an Either will generally only proceed if the instance is Right <value>. In most cases, Left <value> will be skipped over unless
 * you explicitly fmapLeft() the Either. For a more thorough explanation, take a look at the Either overview in the documentation.
 *
 * A word on naming: Even though you'll mostly see Either types representing potential errors and it can help to think of "Left" as an
 * "Error" instance, an Either doesn't explicitly have to be an error. It can simply be an alternative. However, a helpful mnemonic you can use to
 * remember the "preferred" value in an either is "Right is right, Left is wrong."
 */
export class Either<L, R> implements Monad<R> {
	private constructor (readonly type: EitherType, readonly left: L, readonly right: R) {
		//
	}

	/**
	 * Overrides the toString() of the prototype to make logging of Either boxes
	 * more user friendly
	 *
	 * @return {string}
	 */
	public toString(): string {
		if (this.isRight())
			return `Right (${this.right.toString()})`;

		return `Left (${this.left.toString()})`;
	}

	public static Left<L, R>(value: L): Either<L, R> {
		return new Either(EitherType.Left, value, null);
	}

	public static Right<L, R>(value: R): Either<L, R> {
		return new Either(EitherType.Right, null, value);
	}

	public static fromNullable<L, R>(err: L, value: R | null): Either<L, R> {
		if (value === null)
			return Either.Left(err);

		return Either.Right(value);
	}

	public static pure<L, R>(x: R): Either<L, R> {
		return Either.Right(x);
	}

	public isLeft() {
		return this.type === EitherType.Left;
	}

	public isRight() {
		return this.type === EitherType.Right;
	}

	public fmap<U>(fn: (x: R) => U): Either<L, U> {
		if (this.isRight())
			return Either.Right(fn(this.right));

		return Either.Left(this.left);
	}

	public fmapLeft<U>(fn: (x: L) => U): Either<U, R> {
		if (this.isLeft())
			return Either.Left(fn(this.left));

		return Either.Right(this.right);
	}

	public ap<U, V>(x: Either<L, U>): Either<L, V> {
		if (this.isRight() && x.isRight()) {
			if (isLinearFunction<U, V>(this.right)) {
				const fn = this.right;

				return Either.Right(fn(x.right));
			}
			else
				throw new Error(`Type Constraint Failure: Expected Right value ${this.right} to be function, got ${typeof this.right}`);
		}
		if (this.isLeft())
			return Either.Left(this.left);

		return Either.Left(x.left);
	}

	public chain<U>(fn: (x: R) => Either<L, U>): Either<L, U> {
		if (this.isRight())
			return fn(this.right);

		return Either.Left(this.left);
	}

	public caseOf<U>(patterns: EitherPatternMatch<L, R, U>): U {
		if (this.isRight())
			return patterns.right(this.right);

		return patterns.left(this.left);
	}
}
