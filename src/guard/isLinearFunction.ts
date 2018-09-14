export function isLinearFunction<T, U>(x: any): x is (x: T) => U {
	return typeof x === 'function';
}
