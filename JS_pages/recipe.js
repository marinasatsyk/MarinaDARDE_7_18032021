import { TemplateView } from "./Templates/TemplateView.js";

window.onload = function() {

    function validateStringContains(f) {
        if (!f) return false;
        return ("" + f).trim().length > 0
    }

    function createIngredientInRecipe(i) {
        return `<p class="list_p"><span class="ingredient_name">${ i.ingredient}</span>` +
            (validateStringContains(i.quantity) ? (": " + i.quantity +
                (validateStringContains(i.unit) ? " " + i.unit : "")
            ) : "") + "</p>";
    }

    let id = new URLSearchParams(window.location.search).get("recipe");
    console.log(id);
    let ls = localStorage.getItem("data");
    if (!ls) return;

    let data = JSON.parse(ls);
    let r = data.find(r => r.id == +id);

    let recipesDoc = document.getElementById("wrapper");
    let docIng = "";
    let docUst = "";
    let docDesc = r.description; //.length > 145 ? r.description.slice(0, 145) + "..." : r.description;

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


    let article = TemplateView.createElement("div", "card", recipesDoc);
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
}