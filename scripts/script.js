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
createFilter(document.querySelector(".dropdown__menu-ingredients"),"dropdown__menu-ingredient", "dropdown__menu-ingredient-tag", allUniqueIngredients);

function createFilter(menuElt, menuStyle, tagStyle, data){
    const p = document.createElement("p");
    p.classList = menuStyle;
    const tag = document.createElement("a");
    tag.classList = tagStyle + " tag";

    for(let i=0; i<data.length; i++){
        tag.innerHTML = data[i];
        tag.href = data[i];
        p.appendChild(tag);
        menuElt.appendChild(p.cloneNode(true));
    }
}

/* Dropdown appliances creation */

let allUniqueAppliances = [...new Set(allAppliances)].sort();
createFilter(document.querySelector(".dropdown__menu-appliances"),"dropdown__menu-appliance", "dropdown__menu-appliance-tag", allUniqueAppliances);

/* Dropdown ustensils creation */

let allUniqueUstensils = [...new Set(allUstensils.flat().sort())];
createFilter(document.querySelector(".dropdown__menu-ustensils"), "dropdown__menu-ustensil", "dropdown__menu-ustensil-tag", allUniqueUstensils);

/* Tags creation */

const tagList = document.querySelector(".tag-list");
const tagBtn = document.createElement("button");
const tagBtnIcon = document.createElement("i");
tagBtnIcon.classList = "far fa-times-circle";
let allSelectedTag = [];

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

function removeBtn(){
    console.log('1')
}

allSelectedTag.forEach(element => element.addEventListener('click', removeBtn));

const allTags = document.querySelectorAll(".tag");
allTags.forEach(element => element.addEventListener('click', createBtn));

/* Search */

let userSearch = null;

function search(menuElt, data){
    for(let i=0; i<data.length; i++){
        if(menuElt[i].innerText.toUpperCase().includes(userSearch)){
            menuElt[i].style.display = "block";
        } else {
            menuElt[i].style.display = "none";
        }
    }
}

function displayAllFilters(menuElt, data){
    for(let i=0; i<data.length; i++){
        menuElt[i].style.display = "block";
    }
}

/* Main search */

document.querySelector(".search__input").addEventListener('input', mainSearch);

function mainSearch(e){
    userSearch = e.currentTarget.value.toUpperCase();
    if(userSearch.length > 2){
        search(document.querySelectorAll(".dropdown__menu-ingredient"), allUniqueIngredients);
        search(document.querySelectorAll(".dropdown__menu-appliance"), allUniqueAppliances);
        search(document.querySelectorAll(".dropdown__menu-ustensil"), allUniqueUstensils);
    } else {
        displayAllFilters(document.querySelectorAll(".dropdown__menu-ingredient"), allUniqueIngredients);
        displayAllFilters(document.querySelectorAll(".dropdown__menu-appliance"), allUniqueAppliances);
        displayAllFilters(document.querySelectorAll(".dropdown__menu-ustensil"), allUniqueUstensils);
    }
    selectedRecipes();
}

/* Tag search */

document.querySelector(".dropdown__input.color1").addEventListener('input', ingredientSearch);
document.querySelector(".dropdown__input.color2").addEventListener('input', applianceSearch);
document.querySelector(".dropdown__input.color3").addEventListener('input', ustensilSearch);

/* function tagSearch(e, menuElt, data){
    userSearch = e.currentTarget.value.toUpperCase();
    if(userSearch.length > 2){
        search(menuElt, data);
        selectedRecipes();
    } else {
        displayAll(menuElt, data);
    }

} */

function ingredientSearch(e){
    userSearch = e.currentTarget.value.toUpperCase();
    if(userSearch.length > 2){
        search(document.querySelectorAll(".dropdown__menu-ingredient"), allUniqueIngredients);
    } else {
        displayAllFilters(document.querySelectorAll(".dropdown__menu-ingredient"), allUniqueIngredients);
    }
    selectedRecipes();
}

function applianceSearch(e){
    userSearch = e.currentTarget.value.toUpperCase();
    if(userSearch.length > 2){
        search(document.querySelectorAll(".dropdown__menu-appliance"), allUniqueAppliances);
    } else {
        displayAllFilters(document.querySelectorAll(".dropdown__menu-appliance"), allUniqueAppliances);
    }
    selectedRecipes();
}

function ustensilSearch(e){
    userSearch = e.currentTarget.value.toUpperCase();
    if(userSearch.length > 2){
        search(document.querySelectorAll(".dropdown__menu-ustensil"), allUniqueUstensils);
    } else {
        displayAllFilters(document.querySelectorAll(".dropdown__menu-ustensil"), allUniqueUstensils);
    }
    selectedRecipes();
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
