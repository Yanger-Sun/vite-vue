/*
 * sessionStorage 封装
 */
const storage = sessionStorage;
const ss = {
    _prefix: '',

    init(prefix) {
        this._prefix = prefix || '';
    },

    setItem(name, value) {
        try {
            let data = typeof value == 'string' ? value : JSON.stringify(value);
            storage.setItem(`${this._prefix}${name}`, data);
        } catch (e) {
            this.clear();
        }
    },

    getItem(name) {
        let val = storage.getItem(`${this._prefix}${name}`);
        try {
            return JSON.parse(val);
        } catch (e) {
            return val;
        }
    },

    removeItem(name) {
        storage.removeItem(`${this._prefix}${name}`);
    },

    clear() {
        storage.clear();
    }
};

export default ss;
