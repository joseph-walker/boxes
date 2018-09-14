import { reduce, curryN, flip } from 'ramda';
import { Applicative } from 'algebra/typeclass';

function constant<T>(a: T, _: any): T {
	return a;
}

export type PureConstructor<T> = (x: T) => Applicative<T>

export function liftA2<T, U, V>(
	fn: (x: T, y: U) => V,
	fT: Applicative<T>,
	fU: Applicative<U>
): Applicative<V> {
	return (fT.fmap(curryN(2, fn)) as Applicative<(y: U) => V>)
		.ap(fU);
}

export function liftA3<T, U, V, W>(
	fn: (x: T, y: U, z: V) => W,
	fT: Applicative<T>,
	fU: Applicative<U>,
	fV: Applicative<V>
): Applicative<W> {
	return (fT.fmap(curryN(3, fn)) as Applicative<(y: U, z: V) => W>)
		.ap(fU)
		.ap(fV);
}

export function liftA4<T, U, V, W, X>(
	fn: (x: T, y: U, z: V, a: W) => X,
	fT: Applicative<T>,
	fU: Applicative<U>,
	fV: Applicative<V>,
	fW: Applicative<W>
): Applicative<X> {
	return (fT.fmap(curryN(4, fn)) as Applicative<(y: U, z: V, a: W) => X>)
		.ap(fU)
		.ap(fV)
		.ap(fW);
}

export function liftA5<T, U, V, W, X, Y>(
	fn: (x: T, y: U, z: V, a: W, b: X) => Y,
	fT: Applicative<T>,
	fU: Applicative<U>,
	fV: Applicative<V>,
	fW: Applicative<W>,
	fX: Applicative<X>
): Applicative<X> {
	return (fT.fmap(curryN(5, fn)) as Applicative<(y: U, z: V, a: W, b: X) => Y>)
		.ap(fU)
		.ap(fV)
		.ap(fW)
		.ap(fX);
}

export function liftA6<T, U, V, W, X, Y, Z>(
	fn: (x: T, y: U, z: V, a: W, b: X, c: Y) => Z,
	fT: Applicative<T>,
	fU: Applicative<U>,
	fV: Applicative<V>,
	fW: Applicative<W>,
	fX: Applicative<X>,
	fY: Applicative<Y>
): Applicative<Z> {
	return (fT.fmap(curryN(5, fn)) as Applicative<(y: U, z: V, a: W, b: X, c: Y) => Z>)
		.ap(fU)
		.ap(fV)
		.ap(fW)
		.ap(fX)
		.ap(fY);
}

export function traverse<T, U>(pure: PureConstructor<U[]>, fn: (x: T) => Applicative<U>, xs: T[]): Applicative<U[]> {
	// a -> [a] -> [a]
	function consL(x: U, xs: U[]) {
		return [].concat(x, xs);
	}

	// Applicative f => a -> f [a] -> f [a]
	function consF(ys: Applicative<U[]>, x: T): Applicative<U[]> {
		return liftA2(consL, fn(x), ys) as Applicative<U[]>;
	}

    return reduce(consF, pure([] as U[]), xs);
}

export function sequenceA<T>(pure: PureConstructor<T[]>, xs: Applicative<T>[]): Applicative<T[]> {
	return traverse(pure, (x: any) => x, xs);
}

export function takeLeft<T, U>(a: Applicative<T>, b: Applicative<U>): Applicative<T> {
	return liftA2(constant, a, b) as Applicative<T>;
}

export function takeRight<T, U>(a: Applicative<T>, b: Applicative<U>): Applicative<U> {
	return liftA2(flip(constant), a, b) as Applicative<U>;
}
