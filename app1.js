export class Database {
    constructor(file, localStorageName) {
        this._file = file;
        this._lsName = localStorageName;
        this._data = this.getLocalStorage();
        if (this._data) this.loadFile();
    }

    getLocalStorage() {
        let ls = localStorage.getItem(this._lsName);
        if (ls) return JSON.parse(ls);
        return null;
    }

    setLocalStorage() {
        localStorage.setItem(data._lsName, JSON.stringify(this._data))
    }

    get data() { return this._data; }

    set data(data) {
        this._data = data;
        this.setLocalStorage();
    }

    async loadFile() {
        fetch(this._file)
            .then(r => r.json())
            .then(d => this.data = d)
    }

}