import 'mocha';
import { expect } from 'chai';

import { Maybe } from '../../src/algebra/maybe';
import { functorLaws, applicativeLaws, monadLaws } from './typeclass.spec';

function expectEquality<T>(valueA: T, valueB: T) {
	expect(valueA).to.be.deep.equal(valueB);
}

describe('Maybe Monad', function() {
	const tF = (n: number) => Maybe.Just(n + 1);
	const tG = (n: number) => Maybe.Just(n - 2);

	describe('Just Instance', function() {
		functorLaws(Maybe.Just);
		applicativeLaws(Maybe.Just, Maybe.Just);
		monadLaws(Maybe.Just, Maybe.Just, tF, tG);
	});

	describe('Nothing Instance', function() {
		functorLaws(Maybe.Nothing);
		applicativeLaws(Maybe.Just, Maybe.Nothing);
		monadLaws(Maybe.Just, Maybe.Nothing, tF, tG);
	});

	describe('Maybe Creation', function() {
		describe('from()', function() {
			it('should create a Maybe from a nullable or undefined value', function() {
				expectEquality(Maybe.from(true), Maybe.Just(true));
				expectEquality(Maybe.from(false), Maybe.Just(false));
				expectEquality(Maybe.from(null), Maybe.Nothing());
				expectEquality(Maybe.from(undefined), Maybe.Nothing());
			});
		});
	});

	describe('Maybe Class Methods', function() {
		describe('Applicative Lifts', function() {
			describe('lift2()', function() {
				it('should lift an arity 2 function call', function() {
					const arity2 = (a: number, b: number) => a - b;
					const lifted = Maybe.liftA2(arity2);

					const just3 = Maybe.Just(3);
					const just4 = Maybe.Just(4);
					const nothing: Maybe<number> = Maybe.Nothing();

					expect(lifted).to.be.a('function');

					expect(lifted(just4, just3)).to.be.deep.equal(Maybe.Just(1));
					expect(lifted(just4, nothing)).to.be.deep.equal(Maybe.Nothing());
				});
			});
		});
	});

	describe('Maybe Instance Methods', function() {

	});
});
