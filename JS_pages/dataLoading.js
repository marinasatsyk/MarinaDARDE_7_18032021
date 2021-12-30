export class Database {
    constructor(pDataOrFile, localStorageName) {
        if (typeof pDataOrFile === "string") {
            this.loadJson(pDataOrFile, localStorageName);
        } else {
            // console.log(typeof pDataOrFile);
            this._lsName = localStorageName;
            this._data = this.getLocalStorage();
            if (!this._data) this.data = pDataOrFile;
        }
    }

    loadJson(file, localStorageName) {
        this._file = file;
        this._lsName = localStorageName;
        this._data = this.getLocalStorage();
        if (!this._data) this.loadFile();
    }

    getLocalStorage() {
        let ls = localStorage.getItem(this._lsName);
        if (ls) return JSON.parse(ls);
        return null;
    }

    setLocalStorage() {
        localStorage.setItem(this._lsName, JSON.stringify(this._data));
    }

    get data() { return this._data; }

    set data(pData) {
        this._data = pData;
        this.validate();
        this.setLocalStorage();
    }

    async loadFile() {
        fetch(this._file)
            .then(r => r.json())
            .then(d => this.data = d)
    }

    validate() {
        this._data = this._data.map(r => {
            r.ingredients = r.ingredients.map(i => {
                // DB hotfix "quantite" -> "quantity"
                if (i.quantite) i.quantity = i.quantite;
                return i;
            })
            return r;
        })
    }
}