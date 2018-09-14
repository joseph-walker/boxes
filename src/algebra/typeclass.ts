export interface Functor<T> {
	fmap<U>(fn: (x: T) => U): Functor<U>
}

export interface Applicative<T> extends Functor<T> {
	ap<U, V>(x: Applicative<U>): Applicative<V>
}

export interface Monad<T> extends Applicative<T> {
	chain<U>(fn: (x: T) => Monad<U>): Monad<U>
}