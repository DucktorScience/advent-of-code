
export class KeyedMap<K, V> {
  private readonly keyOrigins: Map<string, K> = new Map();
  private readonly data: Map<string, V> = new Map();

  constructor(private readonly getKey: (key: K) => string) { }

  set(key: K, value: V) {
    const keyAsString = this.getKey(key);

    this.keyOrigins.set(keyAsString, key);
    this.data.set(keyAsString, value);
  }

  get(key: K) {
    return this.data.get(this.getKey(key));
  }

  has(key: K) {
    return this.data.has(this.getKey(key));
  }

  clear() {
    this.keyOrigins.clear();
    this.data.clear();
  }

  delete(key: K) {
    const keyAsString = this.getKey(key);

    this.keyOrigins.delete(keyAsString);
    return this.data.delete(keyAsString);
  }

  get size(): number {
    return this.data.size;
  }

  keys() {
    return this.keyOrigins.values();
  }

  values(): SetIterator<V> {
    return this.data.values();
  }
};
