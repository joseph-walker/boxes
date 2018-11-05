import 'mocha';
import { expect } from 'chai';

import { Maybe } from '../../src/algebra/maybe';
import { functorLaws, applicativeLaws, monadLaws } from './typeclass.spec';
import { testLiftN } from './lift.spec';

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
			testLiftN(2, Maybe.lift2, Maybe.Just, Maybe.Nothing);
			testLiftN(3, Maybe.lift3, Maybe.Just, Maybe.Nothing);
			testLiftN(4, Maybe.lift4, Maybe.Just, Maybe.Nothing);
			testLiftN(5, Maybe.lift5, Maybe.Just, Maybe.Nothing);
			testLiftN(6, Maybe.lift6, Maybe.Just, Maybe.Nothing);
		});
	});

	describe('Maybe Instance Methods', function() {
		describe('toString()', function() {
			it('should return a friendly string instead of jank', function() {
				const just = Maybe.Just(4);
				const nothing = Maybe.Nothing();

				expect(just.toString()).to.be.equal('Just (4)');
				expect(nothing.toString()).to.be.equal('Nothing');
			});
		});
	});
});
