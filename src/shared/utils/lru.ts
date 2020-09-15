export class LRU {
    constructor(max: number = 10) {
        this.max = max;
        this.cache = new Map();
    }

    max: number;
    cache: Map<string, any>;

    get(key: string) {
        let item = this.cache.get(key);
        if (item) {
            this.cache.delete(key);
            this.cache.set(key, item);
        }
        return item;
    }

    set(key: string, val: any) {
        if (this.cache.has(key)) this.cache.delete(key);
        else if (this.cache.size == this.max) this.cache.delete(this.first());
        this.cache.set(key, val);
    }

    first() {
        return this.cache.keys().next().value;
    }
}
