import recipes from './recipes.js'

const recipesResults = document.querySelector(".recipes-results");
const card = document.createElement("div");
card.classList = "card";
const cardImg = document.createElement("div");
cardImg.classList = "card__img";
const cardBody = document.createElement("div");
cardBody.classList = "card__body";
const cardTitle = document.createElement("div");
cardTitle.classList = "card__body-title";
const cardTime = document.createElement("div");
cardTime.classList = "card__body-time";
const cardIngredientsList = document.createElement('div');
cardIngredientsList.classList = "card__body-list-ingredients";
const cardIngredients = document.createElement("div");
cardIngredients.classList = "card__body-ingredients";
const cardDescription = document.createElement("div");
cardDescription.classList = "card__body-description";

let dropdowns = document.querySelectorAll('.dropdown-toggle-split');

dropdowns.forEach(dropdown => dropdown.addEventListener('click', show));

function show(e){
    if(e.currentTarget.nextElementSibling.classList.contains('show')){
        e.currentTarget.nextElementSibling.classList.remove('show')
    } else {
        e.currentTarget.nextElementSibling.classList.add('show');
    }
}


for(let i=0; i<recipes.length; i++){
    card.innerHTML = "";
    card.appendChild(cardImg);
    card.appendChild(cardBody);
    cardBody.appendChild(cardTitle);
    cardTitle.innerText = recipes[i].name;
    cardBody.appendChild(cardTime);
    cardTime.innerHTML = "<i class='far fa-clock'></i>" + recipes[i].time;
    cardBody.appendChild(cardIngredientsList);
    cardIngredientsList.innerHTML = "";
    for(let j=0; j<recipes[i].ingredients.length; j++){
        if(recipes[i].ingredients[j].quantity == null || recipes[i].ingredients[j].unit == null){
            cardIngredients.innerHTML = "<span class='card__body-ingredients--bold'>" + recipes[i].ingredients[j].ingredient;
        } else if (recipes[i].ingredients[j].unit == null){
            cardIngredients.innerHTML = "<span class='card__body-ingredients--bold'>" + recipes[i].ingredients[j].ingredient + ":</span>" + " " + recipes[i].ingredients[j].quantity;
        } else {                
            cardIngredients.innerHTML = "<span class='card__body-ingredients--bold'>" + recipes[i].ingredients[j].ingredient + ":</span>" + " " + recipes[i].ingredients[j].quantity + " " + recipes[i].ingredients[j].unit;
        }
        cardIngredientsList.appendChild(cardIngredients.cloneNode(true))
    }
    cardBody.appendChild(cardDescription);
    cardDescription.innerText = recipes[i].description;
    recipesResults.appendChild(card.cloneNode(true));
}