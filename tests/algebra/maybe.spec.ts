import 'mocha';

import { Maybe } from 'algebra/Maybe';
import { functorLaws, applicativeLaws, monadLaws } from './typeclass.spec';

describe('Maybe Monad', function() {
	const tF = (n: number) => Maybe.Just(n + 1);
	const tG = (n: number) => Maybe.Just(n - 2);

	describe('Just Instance', function() {
		functorLaws(Maybe.Just);
		applicativeLaws(Maybe.pure, Maybe.Just);
		monadLaws(Maybe.pure, Maybe.Just, tF, tG);
	});

	describe('Nothing Instance', function() {
		functorLaws(Maybe.Nothing);
		applicativeLaws(Maybe.pure, Maybe.Nothing);
		monadLaws(Maybe.pure, Maybe.Nothing, tF, tG);
	});
});
