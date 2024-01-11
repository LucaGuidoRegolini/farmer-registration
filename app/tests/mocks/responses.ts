export function leftResponse<T>(value: T) {
  return jest.fn().mockResolvedValueOnce({
    isLeft: () => true,
    isRight: () => false,
    value: value,
    map<B>(f: (r: T) => B): B {
      return this.value as any;
    },
  });
}

export function rightResponse<T>(value: T) {
  return jest.fn().mockResolvedValueOnce({
    isLeft: () => false,
    isRight: () => true,
    value: value,
    map<B>(f: (r: T) => B): B {
      return this.value as any;
    },
  });
}
