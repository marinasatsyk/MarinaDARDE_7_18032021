import { TemplateView } from "./Templates/TemplateView.js";

//abstract class for : 
class ListManager {
    constructor() {
        this._array = [];
        this._class = "";
    }

    get list() { return this._array.slice(); }

    pushUnique(item) {
        if (!this._array.includes(item)) this._array.push(item);
    }
}

class Filter extends ListManager {
    constructor(application) {
        super();
        this._application = application;
    }

    filter() {}

    render() {
        for (let item of this._array) {
            TemplateView.createElement("div", this._class)
        }
    }
}

class TagGenerator extends ListManager {
    constructor(application, parent, filter) {
        super();
        this._filter = filter;
        this._parent = parent;
        this._application = application;
    }

    generate(array) {}

    render() {
        let filter = this._filter;
        let app = this._application;
        this._parent.innerHTML = "";
        this._array.map(l => {
            let tag = TemplateView.createElement("div", this._class, this._parent);
            tag.textContent = l;
            tag.onclick = function() {
                console.log("click [" + l + "]");
                filter.pushUnique(l);
                app.search();
            }
        });
    }
}


export class FilterMain extends Filter {
    constructor(application) {
        super(application);
    }

    filter(array, keyword) {
        //filter from main search bar
        return array.filter(r => {
            if (r.name.toLowerCase().includes(keyword)) {
                return true;
            }

            if (r.description.toLowerCase().includes(keyword)) {
                return true;
            }

            r.ingredients.map(ingredient => {
                let ingredientLc = ingredient.ingredient.toLowerCase();
                if (ingredientLc.includes(keyword)) {
                    return true;
                }
            });
        });
    }
}

class FilterTags extends Filter {
    constructor(application, parent) {
        super(application);
        this._parent = parent;
    }

    render() {
        let app = this._application;
        let filter = this;
        this._array.map(tag => {
            let tagAct = TemplateView.createElement("div", this._class, this._parent);
            let tagp = TemplateView.createElement("p", "", tagAct);
            tagp.textContent = tag;
            let tagClose = TemplateView.createElement("i", "closetag far fa-times-circle", tagAct);
            tagClose.onclick = function() {
                console.log("click " + tag);
                console.log(filter._array);
                filter._array.splice(filter._array.indexOf(tag), 1);
                console.log(filter._array);
                app.search();
            }
        })
    }
}

export class FilterIngredient extends FilterTags {
    constructor(application, parent) {
        super(application, parent);
        this._class = "show_tag tag_ing";
    }

    filter(array) {
        let tagList = this._array;
        if (tagList.length < 1) return array;

        return array.filter(r => {
            let resultTags = tagList.filter(tagName => {
                let name = tagName.toLowerCase();
                let res = r.ingredients.filter(i => {
                    let ingredientLc = i.ingredient.toLowerCase();
                    if (ingredientLc.includes(name)) return true;
                })
                return res.length > 0;
            })
            return resultTags.length == tagList.length;
        })
    }
}

export class FilterAppliance extends FilterTags {
    constructor(application, parent) {
        super(application, parent);
        this._class = "show_tag tag_apl";
    }

    filter(array) {
        let tagList = this._array;
        if (tagList.length < 1) return array;

        return array.filter(r => {
            let resultTags = tagList.filter(tagName => {
                let name = tagName.toLowerCase();
                return r.appliance.toLowerCase().includes(name);
            })
            return resultTags.length == tagList.length;
        })
    }
}
export class FilterUstensile extends FilterTags {
    constructor(application, parent) {
        super(application, parent);
        this._class = "show_tag tag_ust";
    }
    filter(array) {
        let tagList = this._array;
        if (tagList.length < 1) return array;

        return array.filter(r => {

            let resultTags = tagList.filter(tagName => {
                let name = tagName.toLowerCase();
                let res = r.ustensils.filter(i => {
                    let ingredientLc = i.toLowerCase();
                    if (ingredientLc.includes(name)) return true;
                })
                return res.length > 0;
            })
            return resultTags.length == tagList.length;
        })
    }
}


export class IngredientGenerator extends TagGenerator {
    constructor(application, parent, filter) {
        super(application, parent, filter);
        this._class = "tagI tag";
    }

    generate(array) {
        array.map(r => {
            r.ingredients.map(ingredient =>
                this.pushUnique(ingredient.ingredient.toLowerCase())
            )
        })
    }
}

export class ApplianceGenerator extends TagGenerator {
    constructor(application, parent, filter) {
        super(application, parent, filter);
        this._class = "tagA tag";
    }

    generate(array) {
        array.map(r => this.pushUnique(r.appliance.toLowerCase()))
    }
}

export class UstensileGenerator extends TagGenerator {
    constructor(application, parent, filter) {
        super(application, parent, filter);
        this._class = "tagU tag";
    }

    generate(array) {
        array.map(r => r.ustensils.map(ustensil => this.pushUnique(ustensil.toLowerCase())))
    }
}