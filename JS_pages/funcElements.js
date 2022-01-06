export function showElements(array) {
    array.map(r => {
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
}