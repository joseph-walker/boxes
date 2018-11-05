import 'mocha';
import { expect } from 'chai';

const argumentNames = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
const argumentValues = [2, -7, 3, -1, 3, -9, 2];
const fnReturnValues = 'return a + b + c + d + e + f + g';

// Stupid JS shit
function arityFactory(arity: number) {
	if (arity < 1) arity = 1;

	const args = [
		...argumentNames.slice(0, arity),
		fnReturnValues.slice(0, 8 + ((arity - 1) * 4))
	];

	return Function.apply(undefined, args);
}

export function testLiftN(n: number, lift: any, pureConstructor: any, nullConstructor: any) {
	describe(`lift${n}()`, function() {
		const fn = arityFactory(n);
		const args = argumentValues.slice(0, n);
		const lifted = lift(fn);

		const nullArg = nullConstructor();
		const pureArgs = args.map(pureConstructor);
		const withNullArg = pureArgs.slice(0, n - 1).concat(nullArg);

		const pureAnswer = pureConstructor(args.reduce((a, b) => a + b));
		const nullAnswer = nullConstructor();

		it(`should lift an arity ${n} function call`, function() {
			expect(lifted.apply(undefined, pureArgs)).to.be.deep.equal(pureAnswer);
			expect(lifted.apply(undefined, withNullArg)).to.be.deep.equal(nullAnswer);
		});
	});
}
