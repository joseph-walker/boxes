import 'mocha';

import { Response } from '../../src/algebra/response';
import { functorLaws, applicativeLaws, monadLaws } from './typeclass.spec';

describe('Response Monad', function() {
	const tF = (n: number) => Response.Ready(n + 1);
	const tG = (n: number) => Response.Ready(n - 2);

	describe('Ready Instance', function() {
		functorLaws(Response.Ready);
		applicativeLaws(Response.pure, Response.Ready);
		monadLaws(Response.pure, Response.Ready, tF, tG);
	});

	describe('Error Instance', function() {
		functorLaws(Response.Error);
		applicativeLaws(Response.pure, Response.Error);
		monadLaws(Response.pure, Response.Error, tF, tG);
	});

	describe('Loading Instance', function() {
		functorLaws(Response.Loading);
		applicativeLaws(Response.pure, Response.Loading);
		monadLaws(Response.pure, Response.Loading, tF, tG);
	});
});
