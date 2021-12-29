import { TemplateView } from "./TemplateView.js";

export class MediaView extends TemplateView {
    constructor(pParent, pClass = "") {
        super(pParent, pClass)
    }

    createContainer() {
        return TemplateView.createElement("article", this._class);
    }

    build(arg) {




    }


}


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


let art_card = TemplateView.createElement("article", "card", recipesDoc);