// NB


// -- map/filter/sort --
// let destination = [];
// for (let i =0; i<origin.length; i++) {
//     let recipe = origin[i];
//       filer -> if (callback(recipe)) destination.push(recipe);
//       map -> doSomething(recipe); destination.push(recipe);
//      sort -> sortingFunction(a,b); destination.push(..);
// }

//  {
//      id : 12,
//      name : "hello"
// }
// function sort_ (a,b) { return a.id>b.id ? -1 : 1; }
// let array1 = [1321,15,64,11248,];
// let array2 = array1.sort(CallBack, "ASC"/"DESC");


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

function init(pRecipes) {

    let filters = [];
    let tagGenerators = [];

    let filterMain = new FilterMain();

    let ingredientFilter = new FilterIngredient(document.querySelector(".tag_active"));
    let ustensileFilter = new FilterUstensile(document.querySelector(".tag_active"));
    let applianceFilter = new FilterAppliance(document.querySelector(".tag_active"));

    let ingredientGenerator = new IngredientGenerator(document.querySelector(".list_i"), ingredientFilter);
    let ustensileGenerator = new UstensileGenerator(document.querySelector(".list_u"), ustensileFilter);
    let applianceGenerator = new ApplianceGenerator(document.querySelector(".list_a"), applianceFilter);

    filters.push(filterMain);

    filters.push(ingredientFilter);
    filters.push(applianceFilter);
    filters.push(ustensileFilter);

    tagGenerators.push(ingredientGenerator);
    tagGenerators.push(applianceGenerator);
    tagGenerators.push(ustensileGenerator);


    let Data = new Database(pRecipes, "data");

    // search from local storage
    let array = Data.data;

    // DOM input elements
    let searchBar = document.querySelector("input.main");
    let ingredientBar = document.querySelector("input.ingredients");
    let applianceBar = document.querySelector("input.appareil");
    let ustensilsBar = document.querySelector("input.ustensiles");
    let place_tagAct = document.querySelector(".tag_active");

    // apply function "search" on each input
    searchBar.oninput =
        ingredientBar.oninput =
        applianceBar.oninput =
        ustensilsBar.oninput = search;

    let MyRecipes = [];
    let MyIngredients = [];
    let MyAppliances = [];
    let MyUstensils = [];
    let MyTags = [];

    /*
    //function for tag ingredients
    function onClickTagIngredient(pTagName) {
        let objIng = { type: "ingredient", name: pTagName }
        MyTags.push(objIng);

        // on click tag
        MyRecipes = MyRecipes.filter(r => {
            let res = r.ingredients.filter(i => {
                let ingredientLc = i.ingredient.toLowerCase();
                if (ingredientLc.includes(pTagName)) return true;
            })
            return res.length > 0;
        })

        render();
    }

    //function for tag appliance
    function onClickTagAppliance(pTagName) {
        let objAppl = { type: "appliance", name: pTagName }
        MyTags.push(objAppl);
        // on click tag
        MyRecipes = MyRecipes.filter(r => {
            let applianceLc = r.appliance.toLowerCase();
            if (applianceLc.includes(pTagName)) return true;
        })
        render();
    }


    //function for tag ustensils
    function onClickTagUstensils(pTagName) {
        console.log(pTagName);


        let objUst = { type: "ustensil", name: pTagName }
        MyTags.push(objUst);


        // on click tag
        MyRecipes = MyRecipes.filter(r => {

            let res = r.ustensils.filter(i => {
                let ustensilLc = i.toLowerCase();
                if (ustensilLc.includes(pTagName)) return true;
            })
            return res.length > 0;
        })

        render();
    }
    */

    function search() {
        /*
        let list_ing = [];
        let list_appl = [];
        let list_ust = [];
        */
        let result0 = array;
        let keyword = searchBar.value.toLowerCase();
        let kwIngredient = ingredientBar.value.toLowerCase();
        let kwAppliance = applianceBar.value.toLowerCase();
        let kwUstensils = ustensilsBar.value.toLowerCase();

        //main search since main search bar in 3 fields for show it on the screen

        if (keyword.length > 2) {

            //filter from main search bar
            result0 = filterMain.filter(result0, keyword);

            //filter from tags lists
            for (let f of filters) {
                result0 = f.filter(result0);
            }

            // console.log(result0);

            // for show ingredients matched after main search
            for (let g of tagGenerators) {
                g.generate(result0);
            }
            list_ing = tagGenerators[0].list;
            list_appl = tagGenerators[1].list;
            list_ust = tagGenerators[2].list;


            /*
            if (MyTags.length > 0) {
                result0 = result0.filter(recipe => {
                    let found = true;

                    for (let t of MyTags) {

                        found = false;
                        switch (t.type) {
                            case "ingredient":
                                for (let ri of recipe.ingredients)
                                    if (ri.ingredient.toLowerCase() == t.name.toLowerCase()) {
                                        found = true;
                                        break;
                                    }
                                break;

                            case "ustensile":
                                for (ru of recipe.ustensils)
                                    if (ru.toLowerCase() == t.name.toLowerCase()) { found = true; break; }
                                break;

                            case "appliance":
                                if (recipe.appliance.toLowerCase() == t.name.toLowerCase()) { found = true; break; }
                                break;

                            default:
                                console.error("illegal tag found", t.type);
                                return false;
                        }
                        if (!found) return false;
                    };

                    return found;
                })
            }
            */

        } else if (keyword.length == 0) {

            if (kwIngredient.length > 2) {
                let kwIngredientLC = kwIngredient.toLowerCase();
                tagGenerators[0]._array = [];
                result0.map(r => {
                    r.ingredients.map(ingredient => {
                        let ingredientLc = ingredient.ingredient.toLowerCase();
                        if (ingredientLc.includes(kwIngredientLC)) tagGenerators[0].pushUnique(ingredientLc);
                    });
                });
            }

            if (kwAppliance.length > 2) {
                let kwApplianceLC = kwAppliance.toLowerCase();
                tagGenerators[1]._array = [];
                result0.map(r => {
                    let appLC = r.appliance.toLowerCase();
                    if (appLC.includes(kwApplianceLC)) tagGenerators[1].pushUnique(appLC);
                });
            };

            if (kwUstensils.length > 2) {
                let kwUstensilsLC = kwUstensils.toLowerCase();
                tagGenerators[2]._array = [];
                result0.map(r => {
                    r.ustensils.map(ust => {
                        let ustLC = ust.toLowerCase();
                        if (ustLC.includes(kwUstensilsLC)) tagGenerators[2].pushUnique(ustLC);
                    })
                });
            };

        }


        console.log(result0);
        //     //repetition of this func


    }

    /*
    //filter a list of ingredients since ing search
    if (kwIngredient.length > 2) {
        list_ing = list_ing.filter(i => i.includes(kwIngredient));
        console.log(list_ing);
    }
    if (kwAppliance.length > 2) {
        list_appl = list_appl.filter(i => i.includes(kwAppliance));
    }
    if (kwUstensils.length > 2) {
        list_ust = list_ust.filter(i => i.includes(kwUstensils));
    }
    */

    MyRecipes = result0;
    MyIngredients = list_ing;
    MyAppliances = list_appl;
    MyUstensils = list_ust;

    render();


}

function render() {

    for (let f of filters) {
        f.render();
    }

    for (let g of tagGenerators) {
        g.render();
    }

    /*
    // populate ingredients
    let tagI = document.querySelector(".list_i");
    tagI.innerHTML = "";
    // MyIngredients.map(l => document.querySelector(".list_i").innerHTML += `<div class="tagI">${l}</div>`);
    MyIngredients.map(l => TemplateView.createElement("div", "tagI tag", tagI).innerHTML = l);

    // populate ustensils
    // TODO
    let tagU = document.querySelector(".list_u");
    tagU.innerHTML = "";
    MyUstensils.map(u => TemplateView.createElement("div", "tagU tag", tagU).innerHTML = u);

    // populate appliances
    // TODO
    let tagA = document.querySelector(".list_a");
    tagA.innerHTML = "";
    MyAppliances.map(a => TemplateView.createElement("div", "tagA tag", tagA).innerHTML = a);



    // populate Tags
    // TODO
    let tagPlace = document.querySelector(".tag_active");

    tagPlace.innerHTML = "";
    MyTags.map(tag => {
        console.log(tag.ingredient);
        let tagclass = "tag_ing",
            tagcolor = "3282F7";
        switch (tag.type) {
            case "appliance":
                tagclass = "tag_apl";
                tagcolor = "68D9A4";
                break;
            case "ustensil":
                tagclass = "tag_ust";
                tagcolor = "ED6454";
                break;
        }
        let tagAct = TemplateView.createElement("div", "show_tag " + tagclass, tagPlace);
        tagAct.style = `background: #${tagcolor}; color: white;`;
        let tagp = TemplateView.createElement("p", "", tagAct);
        tagp.textContent = tag.name;
        let tagClose = TemplateView.createElement("i", "closetag far fa-times-circle", tagAct);
        tagClose.onclick = function() {
            console.log("click " + tag.name);
            MyTags.splice(MyTags.indexOf(tag), 1);
            // console.log(MyTags);
            search();
        }



    });

    */

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


    MyRecipes.map(r => {
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


        // recipesDoc.innerHTML +=
        //     `<article class="card">
        //     <div class="card-img-top"></div>							
        //     <div class="card-body">
        //         <div class="header">
        //             <h2 class="card-title">${r.name}</h2>

        //             <div class="time"> 
        //                 <i class="far fa-clock"></i>
        //                 <p class="p_time">${r.time} min</p>
        //             </div>

        //         </div>

        //         <div class="main_description">
        //             <div class="card_text card_ingr">${docIng}</div>
        //             <p class="card_text card_descr">${docDesc}</p>
        //         </div>  



        //     </div>							
        // </article>`;


    })



    //event onclick ingredient tag
    let all_I = document.querySelectorAll(".tagI");
    for (let i = 0; i < all_I.length; i++) {
        all_I[i].onclick = function(event) {
            onClickTagIngredient(event.target.innerHTML);
            console.dir(event.target);
        }

    }
    console.log(MyTags);
    //event onclick applience tag
    let all_A = document.querySelectorAll(".tagA");
    for (let i = 0; i < all_A.length; i++) {
        all_A[i].onclick = function(event) {
            onClickTagAppliance(event.target.innerHTML);

        }

    }
    //event onclick ustensil tag
    let all_U = document.querySelectorAll(".tagU");
    for (let i = 0; i < all_U.length; i++) {
        all_U[i].onclick = function(event) {
            onClickTagUstensils(event.target.innerHTML);
        }

    }

}


// function toggle visibility


const dropdown_arr = document.querySelectorAll("i.fa-chevron-down");
const list_tags = document.querySelectorAll(".front_tag");
const dropdown_btn = document.querySelectorAll(".btn_all");
const input_menu = document.querySelectorAll(".search_tag");

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
            visible("a", "un appareil", "Appareils");
        } else if (e.currentTarget.classList.contains("u")) {
            visible("u", "un ustensile", "Ustensiles");
        }
    })
});
}


init(recipes);