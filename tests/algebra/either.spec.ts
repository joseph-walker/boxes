import 'mocha';

import { Either } from '../../src/algebra/either';
import { functorLaws, applicativeLaws, monadLaws } from './typeclass.spec';

describe('Either Monad', function() {
	const tF = (n: number) => Either.Right(n + 1);
	const tG = (n: number) => Either.Right(n - 2);

	describe('Right Instance', function() {
		functorLaws(Either.Right);
		applicativeLaws(Either.pure, Either.Right);
		monadLaws(Either.pure, Either.Right, tF, tG);
	});

	describe('Left Instance', function() {
		functorLaws(Either.Left);
		applicativeLaws(Either.pure, Either.Left);
		monadLaws(Either.pure, Either.Left, tF, tG);
	});
});
