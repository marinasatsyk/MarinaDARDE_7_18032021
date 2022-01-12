import { Database } from "./JS_pages/dataLoading.js";
import { recipes } from "./data.js";
import { TemplateView } from "./JS_pages/Templates/TemplateView.js";
import {
    ApplianceGenerator,
    IngredientGenerator,
    UstensileGenerator,
    FilterMain,
    FilterAppliance,
    FilterIngredient,
    FilterUstensile
} from "./JS_pages/funcElements.js";


function validateStringContains(f) {
    if (!f) return false;
    return ("" + f).trim().length > 0
}

class Application {

    constructor() {

        this.filters = [];
        this.tagGenerators = [];

        this.filterMain = new FilterMain(this);

        this.ingredientFilter = new FilterIngredient(this, document.querySelector(".tag_active"));
        this.ustensileFilter = new FilterUstensile(this, document.querySelector(".tag_active"));
        this.applianceFilter = new FilterAppliance(this, document.querySelector(".tag_active"));

        this.ingredientGenerator = new IngredientGenerator(this, document.querySelector(".list_i"), this.ingredientFilter);
        this.ustensileGenerator = new UstensileGenerator(this, document.querySelector(".list_u"), this.ustensileFilter);
        this.applianceGenerator = new ApplianceGenerator(this, document.querySelector(".list_a"), this.applianceFilter);

        this.filters.push(this.filterMain);

        this.filters.push(this.ingredientFilter);
        this.filters.push(this.applianceFilter);
        this.filters.push(this.ustensileFilter);

        this.tagGenerators.push(this.ingredientGenerator);
        this.tagGenerators.push(this.applianceGenerator);
        this.tagGenerators.push(this.ustensileGenerator);

        this.MyRecipes = [];

        this.initDOM();
    }

    initDOM() {

        // function toggle visibility
        // tumultueux
        const dropdown_arr = document.querySelectorAll("i.fa-chevron-down");
        const list_tags = document.querySelectorAll(".front_tag");
        const dropdown_btn = document.querySelectorAll(".btn_all");
        const input_menu = document.querySelectorAll(".search_tag");

        // DOM input elements
        this.searchBar = document.querySelector("input.main");
        this.ingredientBar = document.querySelector("input.ingredients");
        this.applianceBar = document.querySelector("input.appareil");
        this.ustensilsBar = document.querySelector("input.ustensiles");
        this.place_tagAct = document.querySelector(".tag_active");

        // apply function "search" on each input
        let app = this;
        this.searchBar.oninput =
            this.ingredientBar.oninput =
            this.applianceBar.oninput =
            this.ustensilsBar.oninput = function() { app.search() };

        function visible(atr, cont, plH) {

            list_tags.forEach(elem => {
                if (elem.classList.contains(atr)) {
                    elem.classList.toggle("d_grid");
                    elem.classList.toggle("d_none");
                }
            })

            dropdown_arr.forEach(elem => {
                if (elem.classList.contains(atr)) {
                    elem.classList.toggle("animation_arrow");
                }
            })

            dropdown_btn.forEach(elem => {
                if (elem.classList.contains(atr)) {
                    elem.classList.toggle("show_btn");
                }
            })

            //for show all ing, app, ust & change viewport 
            input_menu.forEach(elem => {

                if (elem.classList.contains(atr)) {

                    elem.classList.toggle("input_active_tag");
                    elem.classList.toggle("input_nonactive");


                    if (elem.classList.contains("input_active_tag")) {
                        elem.placeholder = `Rechercher ${cont}`;
                    } else if (!elem.classList.contains("input_active_tag")) {
                        elem.placeholder = plH;
                    }
                }

            })
        }


        dropdown_arr.forEach(elem => {
            elem.addEventListener('click', (e) => {

                if (e.currentTarget.classList.contains("i")) {
                    visible("i", "un ingredient", "Ingredients");
                } else if (e.currentTarget.classList.contains("a")) {
                    visible("a", "un appareil", "Appareil");
                } else if (e.currentTarget.classList.contains("u")) {
                    visible("u", "un ustensile", "Ustensiles");
                }
            })
        });
    }
    load(pRecipes) {
        this.Data = new Database(pRecipes, "data");

        // search from local storage
        this.array = this.Data.data;

    }

    search() {

        this.result0 = this.array;

        let keyword = this.searchBar.value.toLowerCase();
        let kwIngredient = this.ingredientBar.value.toLowerCase();
        let kwAppliance = this.applianceBar.value.toLowerCase();
        let kwUstensils = this.ustensilsBar.value.toLowerCase();

        //main search since main search bar in 3 fields for show it on the screen

        //filter from tags lists
        for (let f of this.filters) {
            this.result0 = f.filter(this.result0, keyword);
        }

        // for show ingredients matched after main search
        for (let g of this.tagGenerators) {
            g.generate(this.result0);
        }

        this.tagGenerators[0].filtered = kwIngredient.length > 2;
        this.tagGenerators[1].filtered = kwAppliance.length > 2;
        this.tagGenerators[2].filtered = kwUstensils.length > 2;

        // if (keyword.length > 2) {

        if (kwIngredient.length > 2) {
            let kwIngredientLC = kwIngredient.toLowerCase();
            this.tagGenerators[0]._array = [];
            this.result0.map(r => {
                r.ingredients.map(ingredient => {
                    let ingredientLc = ingredient.ingredient.toLowerCase();
                    if (ingredientLc.includes(kwIngredientLC)) this.tagGenerators[0].pushUnique(ingredientLc);
                });
            });
        }

        if (kwAppliance.length > 2) {
            let kwApplianceLC = kwAppliance.toLowerCase();
            this.tagGenerators[1]._array = [];
            this.result0.map(r => {
                let appLC = r.appliance.toLowerCase();
                if (appLC.includes(kwApplianceLC)) this.tagGenerators[1].pushUnique(appLC);
            });
        }

        if (kwUstensils.length > 2) {
            let kwUstensilsLC = kwUstensils.toLowerCase();
            this.tagGenerators[2]._array = [];
            this.result0.map(r => {
                r.ustensils.map(ust => {
                    let ustLC = ust.toLowerCase();
                    if (ustLC.includes(kwUstensilsLC)) this.tagGenerators[2].pushUnique(ustLC);
                })
            });
        }
        // }

        console.log(this.result0);
        this.MyRecipes = this.result0;

        this.render();
    }

    render() {

        // for show ingredients matched after main search
        for (let g of this.tagGenerators) {
            if (!g.filtered)
                g.generate(this.result0);
        }

        document.querySelector(".tag_active").innerHTML = "";

        for (let f of this.filters) {
            f.render();
        }

        for (let g of this.tagGenerators) {
            g.render();
        }

        this.renderCards();

    }

    renderCards() {

        function createIngredientInRecipe(i) {
            if (!validateStringContains(i.ingredient)) return "";
            return `<p class="list_p"><span class="ingredient_name">${ i.ingredient}</span>` +
                (validateStringContains(i.quantity) ? (": " + i.quantity +
                    (validateStringContains(i.unit) ? " " + i.unit : "")
                ) : "") + "</p>";
        }

        // populate recipes
        let recipesDoc = document.querySelector(".wrap_recipes");
        recipesDoc.innerHTML = "";

        this.MyRecipes.map(r => {
            let docIng = "";
            let docUst = "";
            let docDesc = r.description.length > 145 ? r.description.slice(0, 145) + "..." : r.description;

            r.ingredients.map(i => {
                docIng += createIngredientInRecipe(i) + "\n";
                //  TemplateView.createElement("p", "p_ing", docIng).innerHTML = i.ingredient;
            })

            r.ustensils.map(u => {
                    let ust = TemplateView.createElement("p", "list_u");
                    ust.textContent = u;
                    docUst += ust;
                    // docUst += `<p class="list_u">${u}</p>`
                })
                // console.log(docIng);

            let article = TemplateView.createElement("arcticle", "card", recipesDoc);
            let img_art_place = TemplateView.createElement("div", "card-img-top", article);

            let card_body = TemplateView.createElement("div", "card-body", article);
            let card_head = TemplateView.createElement("div", "header", card_body);
            let h2_card = TemplateView.createElement("h2", "card-title", card_head);
            h2_card.textContent = r.name;

            let time_cont = TemplateView.createElement("div", "time", card_head);
            let icon_time = TemplateView.createElement("i", "far fa-clock", time_cont);
            let p_time = TemplateView.createElement("p", "p_time", time_cont);
            p_time.textContent = r.time + "min";

            let main_description = TemplateView.createElement("div", "main_description", card_body);
            let card_ingr = TemplateView.createElement("div", "card_text card_ingr", main_description);
            card_ingr.innerHTML = docIng;

            let card_descr = TemplateView.createElement("p", "card_text card_descr", main_description);
            card_descr.textContent = docDesc;
        })
    }
}

var App = new Application();
App.load(recipes);