import 'mocha';
import { expect } from 'chai';

import { Maybe } from '../../src/algebra/maybe';
import { Either } from '../../src/algebra/either';
import { Response } from '../../src/algebra/response';
import { functorLaws, applicativeLaws, monadLaws } from './typeclass.spec';
import { testLiftN } from './lift.spec';

function expectDeepEquality<T>(valueA: T, valueB: T) {
	expect(valueA).to.be.deep.equal(valueB);
}

describe('Maybe Monad', function() {
	const tF = (n: number) => Maybe.Just(n + 1);
	const tG = (n: number) => Maybe.Just(n - 2);

	const just = Maybe.Just(4);
	const nothing = Maybe.Nothing();

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
				expectDeepEquality(Maybe.from(true), Maybe.Just(true));
				expectDeepEquality(Maybe.from(false), Maybe.Just(false));
				expectDeepEquality(Maybe.from(null), Maybe.Nothing());
				expectDeepEquality(Maybe.from(undefined), Maybe.Nothing());
			});
		});

		describe('fromNullable()', function() {
			it('should create a Maybe from a nullable value, passing through Undefined', function() {
				expectDeepEquality(Maybe.fromNullable(null), Maybe.Nothing());
				expectDeepEquality(Maybe.fromNullable(false), Maybe.Just(false));
				expectDeepEquality(Maybe.fromNullable(undefined), Maybe.Just(undefined));
			});
		});

		describe('fromUndefined()', function() {
			it('should create a Maybe from a defined value, passing through null', function() {
				expectDeepEquality(Maybe.fromUndefined(null), Maybe.Just(null));
				expectDeepEquality(Maybe.fromUndefined(false), Maybe.Just(false));
				expectDeepEquality(Maybe.fromUndefined(undefined), Maybe.Nothing());
			});
		});

		describe('fromTruthy()', function() {
			it('should create a Maybe from a truthy value', function() {
				expectDeepEquality(Maybe.fromTruthy(true), Maybe.Just(true));
				expectDeepEquality(Maybe.fromTruthy(false), Maybe.Nothing());
				expectDeepEquality(Maybe.fromTruthy(null), Maybe.Nothing());
				expectDeepEquality(Maybe.fromTruthy(undefined), Maybe.Nothing());
				expectDeepEquality(Maybe.fromTruthy(0), Maybe.Nothing());
				expectDeepEquality(Maybe.fromTruthy(1), Maybe.Just(1));
			});
		});
	});

	describe('Maybe Casting', function() {
		describe('fromEither()', function() {
			it('should create a Maybe from an Either', function() {
				const left = Either.Left(1);
				const right = Either.Right(2);

				expectDeepEquality(Maybe.fromEither(left), Maybe.Nothing());
				expectDeepEquality(Maybe.fromEither(right), Maybe.Just(2));
			});
		});

		describe('fromResponse()', function() {
			const loading = Response.Loading();
			const error = Response.Error(1);
			const ready = Response.Ready(2);

			it('should create a Maybe from a Response', function() {
				expectDeepEquality(Maybe.fromResponse(loading), Maybe.Nothing());
				expectDeepEquality(Maybe.fromResponse(error), Maybe.Nothing());
				expectDeepEquality(Maybe.fromResponse(ready), Maybe.Just(2));
			});
		});

		describe('toEither()', function() {
			it('should turn a Maybe into an Either', function() {
				expectDeepEquality(just.toEither(-1), Either.Right(4));
				expectDeepEquality(nothing.toEither(-1), Either.Left(-1));
			});
		});

		describe('toLoadingResponse()', function() {
			it('should turn a Maybe into a Response, with Nothing becoming Loading', function() {
				expectDeepEquality(just.toLoadingResponse(), Response.Ready(4));
				expectDeepEquality(nothing.toLoadingResponse(), Response.Loading());
			});
		});

		describe('toErrorResponse()', function() {
			it('should turn a Maybe into a Response, with Nothing becoming Error', function() {
				expectDeepEquality(just.toErrorResponse(-1), Response.Ready(4));
				expectDeepEquality(nothing.toErrorResponse(-1), Response.Error(-1));
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

		describe('traverse()', function() {
			it('should take a flatten a Maybe-returning function across a list of values', function() {
				const maybeAddOne = (n: number) => Maybe.Just(n + 1);
				const ns = [1, 2, 3];

				expectDeepEquality(Maybe.traverse(maybeAddOne, ns), Maybe.Just([2, 3, 4]));
			});

			it('should handle the null case of the Maybe-returning function returning Nothing', function() {
				const maybeAddOne = (n: number) => n === 2 ? Maybe.Nothing() : Maybe.Just(n + 1);
				const ns = [1, 2, 3];

				expectDeepEquality(Maybe.traverse(maybeAddOne, ns), Maybe.Nothing());
			});
		});

		describe('sequence()', function() {
			it('should flatten a list of Maybes into a Maybe list', function() {
				const maybeList = [
					Maybe.Just(1),
					Maybe.Just(2),
					Maybe.Just(3)
				];

				const nothingList = maybeList.concat([Maybe.Nothing()]);

				expectDeepEquality(Maybe.sequence(maybeList), Maybe.Just([1, 2, 3]));
				expectDeepEquality(Maybe.sequence(nothingList), Maybe.Nothing());
			});
		});
	});

	describe('Maybe Instance Methods', function() {
		describe('isJust()', function() {
			it('should return true if the Maybe is Just', function() {
				expect(just.isJust()).to.be.equal(true);
				expect(nothing.isJust()).to.be.equal(false);
			});
		});

		describe('isNothing()', function() {
			it('should return true if the Maybe is Just', function() {
				expect(just.isNothing()).to.be.equal(false);
				expect(nothing.isNothing()).to.be.equal(true);
			});
		});

		describe('toString()', function() {
			it('should return a friendly string instead of jank', function() {
				expect(just.toString()).to.be.equal('Just (4)');
				expect(nothing.toString()).to.be.equal('Nothing');
			});
		});

		describe('withDefault()', function() {
			it('should return a Just value, or whatever is passed as the argument if Nothing', function() {
				expect(just.withDefault(3)).to.be.equal(4);
				expect(nothing.withDefault(3)).to.be.equal(3);
			});
		});

		describe('extractUnsafe()', function() {
			it('should return a Just value, or throw if the Maybe is Nothing', function() {
				expect(just.extractUnsafe()).to.be.equal(4);
				expect(() => nothing.extractUnsafe()).to.throw('Type Constraint Failure');
			});
		});

		describe('caseOf()', function() {
			it('should properly pass contained values to the proper lambda', function() {
				const cases = {
					just: (n: number) => n + 1,
					nothing: () => -1
				};

				const caseJust = just.caseOf(cases);
				const caseNothing = nothing.caseOf(cases);

				expect(caseJust).to.be.equal(5);
				expect(caseNothing).to.be.equal(-1);
			});
		});
	});
});
