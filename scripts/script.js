import recipes from './recipes.js'

/* Cards creation */

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

/* Dropdown events*/

let dropdowns = document.querySelectorAll('.dropdown__btn');

dropdowns.forEach(dropdown => dropdown.addEventListener('click', show));

function show(e){
    if(e.currentTarget.nextElementSibling.classList.contains('show')){      // The menu is open...
        e.currentTarget.nextElementSibling.classList.remove('show');        // ... close him        
        e.currentTarget.parentElement.classList.remove('show-all');
    } else {                                                                // The menu is close ...
        e.currentTarget.nextElementSibling.classList.add('show');           // ... scroll down the menu
        e.currentTarget.parentElement.classList.add('show-all');  
    }
}

/* Get all ingredients, appliances and ustensils */

let allIngredients = [];
let allAppliances = [];
let allUstensils = [];
for(let i=0; i<recipes.length; i++){
    for(let j=0; j<recipes[i].ingredients.length; j++)
    allIngredients.push(recipes[i].ingredients[j].ingredient);
    allAppliances.push(recipes[i].appliance);
    allUstensils.push(recipes[i].ustensils);
}

/* Dropdown ingredients creation */

let allUniqueIngredients = [...new Set(allIngredients)].sort();

const menuIngredients = document.querySelector(".dropdown__menu-ingredients");
const ingredient = document.createElement("p");
ingredient.classList = "dropdown__menu-ingredient";
const ingredientTag = document.createElement("a");
ingredientTag.classList = "dropdown__menu-ingredient-tag tag";

for(let i=0; i<allUniqueIngredients.length; i++){
    ingredientTag.innerHTML = allUniqueIngredients[i];
    ingredientTag.href = allUniqueIngredients[i];
    ingredient.appendChild(ingredientTag);
    menuIngredients.appendChild(ingredient.cloneNode(true));
}

/* Dropdown appliances creation */

let allUniqueAppliances = [...new Set(allAppliances)].sort();

const menuAppliances = document.querySelector(".dropdown__menu-appliances");
const appliance = document.createElement("p");
appliance.classList = "dropdown__menu-appliance";
const applianceTag = document.createElement("a");
applianceTag.classList = "dropdown__menu-appliance-tag tag";

for(let i=0; i<allUniqueAppliances.length; i++){
    applianceTag.innerHTML = allUniqueAppliances[i];
    applianceTag.href = allUniqueAppliances[i];
    appliance.appendChild(applianceTag);
    menuAppliances.appendChild(appliance.cloneNode(true));
}

/* Dropdown ustensils creation */

let allUniqueUstensils = [...new Set(allUstensils.flat().sort())];

const menuUstensils = document.querySelector(".dropdown__menu-ustensils");
const ustensil = document.createElement("p");
ustensil.classList = "dropdown__menu-ustensil";
const ustensilTag = document.createElement("a");
ustensilTag.classList = "dropdown__menu-ustensil-tag tag";

for(let i=0; i<allUniqueUstensils.length; i++){
    ustensilTag.innerHTML = allUniqueUstensils[i];
    ustensilTag.href = allUniqueUstensils[i];
    ustensil.appendChild(ustensilTag);
    menuUstensils.appendChild(ustensil.cloneNode(true));
}

/* Search */

let searchInput = document.querySelectorAll("input");
let displayIngredients = document.querySelectorAll(".dropdown__menu-ingredient");

searchInput.forEach(element => element.addEventListener('input', inputSearch));

let userSearch = null;

function inputSearch(e){
    userSearch = e.currentTarget.value.toUpperCase();
    if(userSearch.length > 2){
        ingredientSearch();
        selectedRecipes();
    }
}

function ingredientSearch(){
    for(let i=0; i<allUniqueIngredients.length; i++){
        if(displayIngredients[i].innerText.toUpperCase().includes(userSearch)){
            displayIngredients[i].style.display = "block";
        } else {
            displayIngredients[i].style.display = "none";
        }
    }
}

/* Show selected recipes */

let cards = document.querySelectorAll(".card");
function selectedRecipes(){
    for(let i=0; i<cards.length; i++){
        if(cards[i].innerText.toUpperCase().includes(userSearch)){
            cards[i].style.display = "block";
        } else {
            cards[i].style.display = "none";
        }
    }
}

/* Tags*/

const tagList = document.querySelector(".tag-list");
const tagBtn = document.createElement("button");
const tagBtnIcon = document.createElement("i");
tagBtnIcon.classList = "far fa-times-circle";

function removeBtn(){
    console.log('ok');
}

const allSelectedTag = document.querySelectorAll(".btn-filter");
allSelectedTag.forEach(element => element.addEventListener('click', removeBtn));

function createBtn(e){
    e.preventDefault();
    tagBtn.classList = "btn-filter";
    if(e.currentTarget.classList.contains("dropdown__menu-ingredient-tag")){
        tagBtn.classList.add("color1");
    }
    if(e.currentTarget.classList.contains("dropdown__menu-appliance-tag")){
        tagBtn.classList.add("color2");
    }
    if(e.currentTarget.classList.contains("dropdown__menu-ustensil-tag")){
        tagBtn.classList.add("color3");
    }
    if(!e.currentTarget.classList.contains("tag-selected")){
        tagBtn.innerText = e.currentTarget.innerText;
        tagBtn.type = "button";
        tagBtn.appendChild(tagBtnIcon);
        tagList.appendChild(tagBtn.cloneNode(true));
    }
    e.currentTarget.classList.add("tag-selected");
}

const allTags = document.querySelectorAll(".tag");
allTags.forEach(element => element.addEventListener('click', createBtn));



