import { TemplateView } from "./Templates/TemplateView.js";

//abstract/generate class for all filters: 
class ListManager {
    constructor() {
        this._array = [];
        this._class = "";
    }


    get list() { return this._array.slice(); }

    // ==> replace includes, but dont repeat the element
    // pushUnique(item) {
    //     if (!this._array.includes(item)) this._array.push(item);
    // }

    //methode generate  for show a list after sort
    pushUnique(item) {
        for (let i = 0; i < this._array.length; i++)
            if (this._array[i] == item) return false;
        this._array.push(item);
        return true;
    }

    //emulation of indexOf methode
    indexOfChar(val, c) {
        for (let i = 0; i < val; i++) {
            if (val[i] == c[0]) return i;
        }
        return -1;
    }

    stringIncludes(pStr, pValue) {
            return pStr.includes(pValue);
        }
        //emulation of the methode string.prototype.includes
    stringIncludes_back(pStr, pValue) {
        let str = pStr.trim(),
            value = pValue.trim();

        for (let c1 = 0; c1 < str.length; c1++) {

            if (str[c1] == value[0]) {

                let found = true;

                for (let c2 = 1; c2 < value.length; c2++) {
                    if (str[c1 + c2] != value[c2]) {
                        found = false;
                        break;
                    }
                }

                if (found) return true;
            }
        }
        return false;
    }

    empty() {
        return !this._array || this._array.length < 1;
    }
}

/*for create element  */
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

/*create list  based on input main*/
class TagGenerator extends ListManager {
    constructor(application, parent, filter) {
        super();
        this._filter = filter;
        this._parent = parent;
        this._application = application;
    }

    generate(array) {
        this._array = [];
    }

    render() {
        let filter = this._filter;
        let app = this._application;
        this._parent.innerHTML = "";

        for (let i = 0; i < this._array.length; i++) {
            let l = this._array[i];
            let tag = TemplateView.createElement("div", this._class, this._parent);
            tag.textContent = l;
            tag.onclick = function() {
                console.log("click [" + l + "]");
                filter.pushUnique(l);
                app.search();
            }
        }

    }
}

//for do sort from main search bar 
export class FilterMain extends Filter {
    constructor(application) {
        super(application);
    }


    filter(array, keyword) {
        if (keyword.length < 1) return array.slice(0);


        let output = new Array(array.length),
            o = 0;
        for (let i = 0; i < array.length; i++) {
            let r = array[i];
            if (r.name.toLowerCase().includes(keyword)) {
                output[o++] = r;
            } else if (r.description.toLowerCase().includes(keyword)) {
                output[o++] = r;
            } else {
                for (let k = 0; k < r.ingredients.length; k++) {
                    let ingredient = r.ingredients[k];
                    let ingredientLc = ingredient.ingredient.toLowerCase();
                    if (ingredientLc.includes(keyword)) {
                        output[o++] = r;
                        break;
                    }
                }
            }
        }
        output.length = o;
        return output;

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

        for (let i = 0; i < this._array.length; i++) {
            let tag = this._array[i]
            console.log(this._array);
            let tagAct = TemplateView.createElement("div", this._class, this._parent);
            let tagp = TemplateView.createElement("p", "", tagAct);
            tagp.textContent = this._array[i];
            let tagClose = TemplateView.createElement("i", "closetag far fa-times-circle", tagAct);
            console.log(this._array[i]);
            tagClose.onclick = function() {
                console.log("click " + tag);
                filter._array.splice(filter._array.indexOf(tag), 1);
                app.search();
            }
        }

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
        let output = new Array(array.length),
            o = 0;
        for (let i = 0; i < array.length; i++) {
            let r = array[i];
            let result = 0;
            for (let t = 0; t < tagList.length; t++) {
                let tagName = tagList[t];
                let name = tagName.toLowerCase();
                let found = false;
                for (let ing = 0; ing < r.ingredients.length; ing++) {
                    let ingredient = r.ingredients[ing].ingredient;
                    let ingredientLc = ingredient.toLowerCase();
                    if (ingredientLc.includes(name)) {
                        found = true;
                        break;
                    }
                }
                if (found) result++;
            }
            if (result == tagList.length) output[o++] = r;
        }
        output.length = o;
        return output;
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

        let output = new Array(array.length),
            o = 0;
        for (let indexRecipe = 0; indexRecipe < array.length; indexRecipe++) {
            let recipe = array[indexRecipe];
            let found = true;
            for (let t = 0; t < tagList.length; t++) {
                let tagName = tagList[t];
                let name = tagName.toLowerCase();
                if (!recipe.appliance.toLowerCase().includes(name)) {
                    found = false;
                    break;
                }
            }
            if (found) output[o++] = recipe;
        }
        output.length = o;
        return output;

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

        let output = new Array(array.length),
            o = 0;
        for (let indexRecipe = 0; indexRecipe < array.length; indexRecipe++) {
            let recipe = array[indexRecipe];

            let result = 0;
            for (let t = 0; t < tagList.length; t++) {
                let tagName = tagList[t];
                let name = tagName.toLowerCase();

                for (let indexUstensil = 0; indexUstensil < recipe.ustensils.length; indexUstensil++) {
                    let ustensil = recipe.ustensils[indexUstensil].toLowerCase();
                    if (ustensil.includes(name)) {
                        result++;
                        break;
                    }
                }
            }

            if (result == tagList.length) output[o++] = recipe;
        }
        output.length = o;
        return output;


    }
}


export class IngredientGenerator extends TagGenerator {
    constructor(application, parent, filter) {
        super(application, parent, filter);
        this._class = "tagI tag";
    }

    generate(array) {
        super.generate();

        for (let i = 0; i < array.length; i++) {
            let r = array[i].ingredients;
            for (let k = 0; k < r.length; k++) {
                this.pushUnique(r[k].ingredient.toLowerCase())
            }
        }
    }
}

export class ApplianceGenerator extends TagGenerator {
    constructor(application, parent, filter) {
        super(application, parent, filter);
        this._class = "tagA tag";
    }

    generate(array) {
        super.generate();

        for (let i = 0; i < array.length; i++) {
            let r = array[i];
            this.pushUnique(r.appliance.toLowerCase());

        }

    }
}

export class UstensileGenerator extends TagGenerator {
    constructor(application, parent, filter) {
        super(application, parent, filter);
        this._class = "tagU tag";
    }

    generate(array) {
        super.generate();

        for (let i = 0; i < array.length; i++) {
            let ustensils = array[i].ustensils;

            for (let k = 0; k < ustensils.length; k++) {
                let ustensil = ustensils[k];
                this.pushUnique(ustensil.toLowerCase())

            }

        }

    }
}