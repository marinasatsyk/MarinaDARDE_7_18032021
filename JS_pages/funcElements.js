import { TemplateView } from "./Templates/TemplateView.js";

//abstract class for : 
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
    pushUnique(item) {
        for (let i = 0; i < this._array.length; i++)
            if (this._array[i] == item) return false;
        this._array.push(item);
        return true;
    }


    indexOfChar(val, c) {
        for (let i = 0; i < val; i++) {
            if (val[i] == c[0]) return i;
        }
        return -1;
    }

    stringIncludes(pStr, pValue) {
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

    generate(array) {
        this._array = [];
    }

    render() {
        let filter = this._filter;
        let app = this._application;
        this._parent.innerHTML = "";
        //replace map 
        // this._array.map(l => {
        //     let tag = TemplateView.createElement("div", this._class, this._parent);
        //     tag.textContent = l;
        //     tag.onclick = function() {
        //         console.log("click [" + l + "]");
        //         filter.pushUnique(l);
        //         app.search();
        //     }
        // });

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


export class FilterMain extends Filter {
    constructor(application) {
        super(application);
    }

    //REPLACE FILTER & MAP

    filter(array, keyword) {
        if (keyword.length < 1) return array.slice(0);

        // filter from main search bar
        let output = [];
        for (let i = 0; i < array.length; i++) {
            let r = array[i];
            if (this.stringIncludes(r.name.toLowerCase(), keyword)) {
                output.push(r);
            } else if (this.stringIncludes(r.description.toLowerCase(), keyword)) {
                output.push(r);
            } else {
                for (let k = 0; k < r.ingredients.length; k++) {
                    let ingredient = r.ingredients[k];
                    let ingredientLc = ingredient.ingredient.toLowerCase();
                    if (this.stringIncludes(ingredientLc, keyword)) {
                        output.push(r);
                        break;
                    }
                }
            }
        }
        return output;

        /*
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
        */

        // let arr_copy = [];

        // for (let i = 0; i < array.length; i++) {

        //     //replace includes

        //     if (array[i].name.toLowerCase() == keyword) {
        //         // arr_copy.push(array[i]);
        //         return true;
        //     } else {
        //         let name = [];
        //         n_index.push(i);
        //     }

        //     if (array[i].description.toLowerCase() == keyword) {
        //         // arr_copy.push(array[i].description);
        //         return true;
        //     } else {
        //         let d = [];
        //         d_index.push(i);
        //     }


        //     for (let ingredient = 0; ingredient < array[i][ingredient].length; ingredient++) {
        //         let ingredientLc = ingrarray[i][ingredient].ingredient.toLowerCase();
        //         if (ingredientLc.includes(keyword)) {
        //             arr_copy.push(ingredientLc);
        //             return true;
        //         }

        //     }


        // }
        // array = arr_copy;
        // return array;
        // // console.log(arr_copy);
        // // return arr_copy;

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

        let output = [];

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
                    if (this.stringIncludes(ingredientLc, name)) {
                        found = true;
                        break;
                    }
                }
                if (found) result++;
            }

            if (result == tagList.length) output.push(r);
        }

        return output;
        /*
        return array.filter(r => {
            let resultTags = tagList.filter(tagName => {
                let name = tagName.toLowerCase();
                let res = r.ingredients.filter(i => {
                    let ingredientLc = i.ingredient.toLowerCase();
                    if (this.stringIncludes(ingredientLc, name)) return true;
                })
                return res.length > 0;
            })
            return resultTags.length == tagList.length;
        })
        */
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

        let output = [];
        for (let indexRecipe = 0; indexRecipe < array.length; indexRecipe++) {
            let recipe = array[indexRecipe];
            let found = true;
            for (let t = 0; t < tagList.length; t++) {
                let tagName = tagList[t];
                let name = tagName.toLowerCase();
                if (!this.stringIncludes(recipe.appliance.toLowerCase(), name)) {
                    found = false;
                    break;
                }
            }
            if (found) output.push(recipe);
        }
        return output;
        /*
        return array.filter(r => {
            let resultTags = tagList.filter(tagName => {
                let name = tagName.toLowerCase();
                return r.appliance.toLowerCase().includes(name);
            })
            return resultTags.length == tagList.length;
        })
        */
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

        let output = [];
        for (let indexRecipe = 0; indexRecipe < array.length; indexRecipe++) {
            let recipe = array[indexRecipe];

            let result = 0;
            for (let t = 0; t < tagList.length; t++) {
                let tagName = tagList[t];
                let name = tagName.toLowerCase();

                for (let indexUstensil = 0; indexUstensil < recipe.ustensils.length; indexUstensil++) {
                    let ustensil = recipe.ustensils[indexUstensil].toLowerCase();
                    if (this.stringIncludes(ustensil, name)) {
                        result++;
                        break;
                    }
                }
            }

            if (result == tagList.length) output.push(recipe);
        }

        return output;

        /*
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
        */
    }
}


export class IngredientGenerator extends TagGenerator {
    constructor(application, parent, filter) {
        super(application, parent, filter);
        this._class = "tagI tag";
    }

    generate(array) {
        super.generate();
        /*
        array.map(r => {
            r.ingredients.map(ingredient =>
                this.pushUnique(ingredient.ingredient.toLowerCase())
            )
        })
        */
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
        array.map(r => this.pushUnique(r.appliance.toLowerCase()))
    }
}

export class UstensileGenerator extends TagGenerator {
    constructor(application, parent, filter) {
        super(application, parent, filter);
        this._class = "tagU tag";
    }

    generate(array) {
        super.generate();
        array.map(r => r.ustensils.map(ustensil => this.pushUnique(ustensil.toLowerCase())))
    }
}