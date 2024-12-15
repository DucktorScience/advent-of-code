
export class KeyedSet<T> {
  private readonly data: Map<string, T> = new Map();

  constructor(private readonly getKey: (value: T) => string) { }

  add(value: T): this {
    this.data.set(this.getKey(value), value);
    return this;
  }

  clear() {
    this.data.clear();
  }

  delete(point: T) {
    return this.data.delete(this.getKey(point));
  }

  has(point: T) {
    return this.data.has(this.getKey(point));
  }

  forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void {
    for (const value of this.data.values()) {
      callbackfn.call(thisArg, value, value, this);
    }
  }

  get size(): number {
    return this.data.size;
  }

  /**
   * Returns an iterable of values in the set.
   */
  values(): SetIterator<T> {
    return this.data.values();
  }
}
