import { Database } from "./app1.js";
import { recipes } from "./data.js";
import { TemplateView } from "./TemplateView.js"


let Data = new Database(recipes, "data");



//To Do search sice local storage
let array = [];


recipes.map(r => {
    array.push(r);
})

// console.log(array);

let searchBar = document.querySelector("input.main");
let ingredientBar = document.querySelector("input.ingredients");
let applianceBar = document.querySelector("input.appareil");
let ustensilsBar = document.querySelector("input.ustensiles");
let place_tagAct = document.querySelectorAll(".tag_active");
//


// 

searchBar.oninput =
    ingredientBar.oninput =
    applianceBar.oninput =
    ustensilsBar.oninput = search;
let MyRecipes = [];
let MyIngredients = [];
let MyAppliances = [];
let MyUstensils = [];
let MyTags = [];

//function for tag ingredients
function onClickTagIngredient(pTagName) {
    console.dir(pTagName);
    let objIng = { "ingredient": pTagName }
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

    let objAppl = { "appliance": pTagName }
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


    let objUst = { "ustensil": pTagName }
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


function search() {
    let list_ing = [];
    let list_appl = [];
    let list_ust = [];
    let result0 = array;
    let keyword = searchBar.value.toLowerCase();
    let kwIngredient = ingredientBar.value.toLowerCase();
    let kwAppliance = applianceBar.value.toLowerCase();
    let kwUstensils = ustensilsBar.value.toLowerCase();

    //main search since main search bar in 3 fields for show it on the screen

    if (keyword.length > 2) {
        result0 = array.filter(r => {
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

        //for show ingredients matched after main search
        result0.map(r => {
            //?? if other tag is selected
            r.ingredients.map(ingredient => {
                let ingredientLc = ingredient.ingredient.toLowerCase();
                if (!list_ing.includes(ingredientLc)) {
                    list_ing.push(ingredientLc);
                }
            })

            //for show appliance matched after main search
            let applianceLc = r.appliance.toLowerCase();

            if (!list_appl.includes(applianceLc)) {
                list_appl.push(applianceLc);
            }

            //for show ustensils matched after main search
            r.ustensils.map(ustensil => {
                let ustensilLc = ustensil.toLowerCase();
                if (!list_ust.includes(ustensilLc)) {
                    list_ust.push(ustensilLc);
                }
            })

        });
        // console.log(list_ing.toString());
        // console.log(list_appl.toString());
        // console.log(list_ust.toString());
    }


    //filter a list of ingredients since ing search
    if (kwIngredient.length > 2) {
        list_ing = list_ing.filter(i => i.includes(kwIngredient));
    }
    if (kwAppliance.length > 2) {
        list_appl = list_appl.filter(i => i.includes(kwAppliance));
    }
    if (kwUstensils.length > 2) {
        list_ust = list_ust.filter(i => i.includes(kwUstensils));
    }


    MyRecipes = result0;
    MyIngredients = list_ing;
    MyAppliances = list_appl;
    MyUstensils = list_ust;

    render();

    // let result1 = result0;
    // for (let ustensil of all_ustensils) {

    //	 result1 = result1.filter(r =>
    //		 r.ustensils.filter(u => u.toLowerCase().includes(ustensil)).length > 0
    //	 )
    // }
    // console.log(result1);

}

function render() {

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
    console.log(tagPlace);
    tagPlace.innerHTML = "";
    MyTags.map(tag => {
        console.log(tag.ingredient);
        let tagAct;
        if (tag.ingredient) {
            tagAct = TemplateView.createElement("div", "show_tag tag_ing", tagPlace);
            tagAct.innerHTML = `<p>${tag.ingredient}</p> <i class="far fa-times-circle"></i>`;
            tagAct.style = "background: #3282F7; color: white;"
        } else if (tag.appliance) {
            tagAct = TemplateView.createElement("div", "show_tag tag_apl", tagPlace);
            tagAct.innerHTML = `<p>${tag.appliance}</p> <i class="far fa-times-circle"></i>`;
            tagAct.style = "background: #68D9A4; color: white;"
        } else if (tag.ustensil) {
            tagAct = TemplateView.createElement("div", "show_tag tag_ust", tagPlace);
            tagAct.innerHTML = `<p>${tag.ustensil}</p> <i class="far fa-times-circle"></i>`;
            tagAct.style = "background: #ED6454; color: white;"
        }

        // tagAct.style.background =

    });






    // populate recipes
    let recipesDoc = document.querySelector(".wrap_recipes");
    recipesDoc.innerHTML = "";

    console.log(MyRecipes);
    MyRecipes.map(r => {
        let docIng = "";
        let docUst = "";

        r.ingredients.map(i => {
            if (i.ingredient && i.quantity && i.unit) {
                docIng += `<p class="list_p">${i.ingredient}: ${i.quantity} ${i.unit}</p>`;

            } else if (i.ingredient && i.quantity && !i.unit) {
                docIng += `<p class="list_p">${i.ingredient}: ${i.quantity}</p>`;

            } else if (i.ingredient && !i.quantity && !i.unit) {
                docIng += `<p class="list_p">${i.ingredient}</p>`;
            }

            //  TemplateView.createElement("p", "p_ing", docIng).innerHTML = i.ingredient;

        })
        r.ustensils.map(u => {
            docUst += `<p class="list_u">${u}</p>`
        })
        console.log(docIng);

        recipesDoc.innerHTML +=
            `<article class="card">
		        <div class="card-img-top"></div>							
		        <div class="card-body">
                    <div class="header">
                        <h2 class="card-title">${r.name}</h2>
                        
                        <div class="time"> 
                            <i class="far fa-clock"></i>
                            <p class="p_time">${r.time} min</p>
                        </div>

                    </div>
                   
                    <div class="main_description">
                        <div class="card_text card_ingr">${docIng}</div>
                        <p class="card_text card_descr">${r.description}</p>
                    </div>  
                    
                    

                </div>							
        	</article>`;
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



    console.log(MyRecipes);
    console.log(MyTags);
}


// function toggle visibility


let dropdown_arr = document.querySelectorAll("i.fa-chevron-down");
let list_tags = document.querySelectorAll(".front_tag");
let dropdown_btn = document.querySelectorAll(".btn_all");
let input_menu = document.querySelectorAll(".search_tag");

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
            visible("u", "une ustensile", "Ustensiles");
        }
    })
});