import 'mocha';
import { expect } from 'chai';

import { Functor, Applicative, Monad } from '../../src/algebra/typeclass';

type NumberFn = (x: number) => number;
type MonadTestFn = (x: number) => Monad<number>;

const id = (x: any) => x;

const gn = (x: number) => x + 1;
const fn = (x: number) => x - 2;

function compose<T, U, V>(f: (b: U) => V, g: (a: T) => U) {
    return (x: T) => f(g(x));
}

const curriedCompose = (u: NumberFn) => (v: NumberFn) => compose(u, v);

export function functorLaws(f: (x: any) => Functor<any>): void {
	it('should satisfy functor identity', function() {
		expect(f(42).fmap(id)).to.be.deep.equal(f(42));
	});

	it('should satisfy functor composition', function() {
		expect(f(42).fmap(compose(gn, fn))).to.be.deep.equal(f(42).fmap(gn).fmap(fn));
	});
}

// Pure is not an instance method but rather a typeclass method, which would mean it would need to be static
// on the Applicative class. However, Typescript does not allow static methods to be defined in interfaces. Therefore,
// we have to pass Pure in as an argument.
export function applicativeLaws(pure: (x: any) => Applicative<any>, f: (x: any) => Applicative<any>): void {
	it('should satisfy applicative identity', function() {
		expect((pure(id)).ap(f(42))).to.be.deep.equal(f(42));
	});

	it('should satisfy applicative homomorphism', function() {
		expect(pure(fn).ap(pure(42))).to.be.deep.equal(pure(fn(42)));
	});

	it('should satisfy applicative interchange', function() {
		expect(f(fn).ap(pure(42))).to.be.deep.equal(pure((y: number) => fn(42)).ap(f(fn)));
	});

	it('should satisfy applicative composition', function() {
		const u = f(gn);
		const v = f(fn);
		const w = f(42);

		expect(pure(curriedCompose).ap(u).ap(v).ap(w)).to.be.deep.equal(u.ap(v.ap(w)));
	});
}

// JS doesn't support point-free notation, so we need to supply a monadic test function that returns an instance
// of whatever monad we're testing
export function monadLaws(pure: (x: any) => Monad<any>, m: (x: any) => Monad<any>, testFnF: MonadTestFn, testFnG: MonadTestFn): void {
	it('should satisy left identity', function() {
		expect(pure(42).chain(testFnF)).to.be.deep.equal(testFnF(42));
	});

	it('should satisfy right identity', function() {
		expect(m(42).chain(pure)).to.be.deep.equal(m(42));
	});

	it('should satisfy monadic associativity', function() {
		expect(m(42).chain(testFnF).chain(testFnG)).to.be.deep.equal(m(42).chain((x: number) => testFnF(x).chain(testFnG)));
	});
}
