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