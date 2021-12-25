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
    console.log(pTagName);
    MyTags.push(pTagName);
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
    console.log(pTagName);
    MyTags.push(pTagName);
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


    MyTags.push(pTagName);


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
        console.log(list_ing.toString());
        console.log(list_appl.toString());
        console.log(list_ust.toString());
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
        let tagAct = TemplateView.createElement("div", "show_tag", tagPlace);
        // tagAct.style.background =
        tagAct.innerHTML = tag;
    });






    // populate recipes
    let recipesDoc = document.querySelector(".wrap_recipes");
    recipesDoc.innerHTML = "";

    console.log(MyRecipes);
    MyRecipes.map(r => {
        let docIng = "";
        let docUst = "";
        let unit = "";
        r.ingredients.map(i => {
            if (i.unit) {
                docIng += `<p>${i.ingredient}: ${i.quantity} ${i.unit}</p>`;

            } else {
                docIng += `<p>${i.ingredient}: ${i.quantity}</p>`;
            }


            ;


            //  TemplateView.createElement("p", "p_ing", docIng).innerHTML = i.ingredient;

        })
        r.ustensils.map(u => {
            docUst += `<p>${u}</p>`
        })
        recipesDoc.innerHTML +=
            `<div class="card col-3">
		        <img class="card-img-top" src="" alt="">							
		        <div class="card-body">
                    
                    <h2 class="card-title">${r.name}</h2>
                    <div class="time"> <i class="far fa-clock"></i>
                    <p class="font-weight-bold">${r.time} min</p></div>
                   
			        <div class="card-text">${docIng}</div>
			        <p class="card-text">${r.description}</p>
			        <div class="card-text">${r.appliance}</div>
			        <div class="card-text">${docUst}</div>
                </div>							
        	</div>`;
    })


    //event onclick ingredient tag
    let all_I = document.querySelectorAll(".tagI");
    for (let i = 0; i < all_I.length; i++) {
        all_I[i].onclick = function(event) {
            onClickTagIngredient(event.target.innerHTML);
        }

    }

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








// let c = ['avocat pampleumousse', 'pomme', 'banane']
// let a = "marina"
// let b = "mousse"

// for (let i = 0; i < c.length; i++) {
//   console.log(c[i].indexOf(b));



// }

// let e = c.filter(word => {
//   if (word.indexOf(b) != -1) {
//   return true;
//   }
// })
// console.log(e);