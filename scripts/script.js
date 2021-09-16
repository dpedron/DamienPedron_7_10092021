import recipes from './recipes.js'
import {filterList, createFilter} from "./_components.js"

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
    multiLineEllipsis();
    recipesResults.appendChild(card.cloneNode(true));
}


    function multiLineEllipsis(){
        let recipesInstruction = cardDescription.innerText;
        let counter = 0;
        while((cardDescription.scrollHeight <= cardDescription.offsetHeight)  && (counter<=recipesInstruction.length)){
            counter ++;
            cardDescription.innerText = recipesInstruction.substr(0,  counter) + "...";
        }
        if(cardDescription.scrollHeight > cardDescription.offsetHeight){
            cardDescription.innerText = recipesInstruction.substr(0, counter-1) + "...";
        }
    }
    



/* Dropdown */

let dropdownsBtn = document.querySelectorAll('.dropdown__btn');
dropdownsBtn.forEach(dropdownBtn => dropdownBtn.addEventListener('click', filterList));

/* Get all ingredients, appliances and ustensils with the first letter in uppercase and others in lowercase */

let allIngredients = [];
let allAppliances = [];
let allUstensils = [];
for(let i=0; i<recipes.length; i++){
    allAppliances.push(recipes[i].appliance[0].toUpperCase() + recipes[i].appliance.slice(1));  // Appliances 
    for(let j=0; j<recipes[i].ingredients.length; j++){                                         // Ingredients
        allIngredients.push(recipes[i].ingredients[j].ingredient[0].toUpperCase() +  
        recipes[i].ingredients[j].ingredient.slice(1));
    }
    for(let j=0; j<recipes[i].ustensils.length; j++){                                           // Ustensils
        allUstensils.push(recipes[i].ustensils[j][0].toUpperCase() +  
        recipes[i].ustensils[j].slice(1));
    }
}

/* Dropdown ingredients creation */

let allUniqueIngredients = [...new Set(allIngredients)].sort(); // Sort ingredients by alphabetical order ...
createFilter(document.querySelector(".dropdown__menu-ingredients"),"dropdown__menu-ingredient", "dropdown__menu-ingredient-tag", allUniqueIngredients); // ... and add them to DOM

let allUniqueAppliances = [...new Set(allAppliances)].sort(); // Sort appliances by alphabetical order ...
createFilter(document.querySelector(".dropdown__menu-appliances"),"dropdown__menu-appliance", "dropdown__menu-appliance-tag", allUniqueAppliances); // ... and add them to DOM

let allUniqueUstensils = [...new Set(allUstensils)].sort(); // Sort ustensils by alphabetical order ...
createFilter(document.querySelector(".dropdown__menu-ustensils"), "dropdown__menu-ustensil", "dropdown__menu-ustensil-tag", allUniqueUstensils); // ... and add them to DOM

/* Tags creation */

const tagList = document.querySelector(".tag-list");
const tagBtn = document.createElement("button");
const tagBtnIcon = document.createElement("i");
tagBtnIcon.classList = "far fa-times-circle";
let allSelectedTag = [];
let allFilters = [];

function createBtn(e){
    e.preventDefault();
    tagBtn.classList = "btn-filter";
    if(e.currentTarget.classList.contains("dropdown__menu-ingredient-tag")){    
        tagBtn.classList.add("color1");                                         // Add the ingredient background-color to the tag
    }
    if(e.currentTarget.classList.contains("dropdown__menu-appliance-tag")){     
        tagBtn.classList.add("color2");                                         // Add the appliance background-color to the tag
    }
    if(e.currentTarget.classList.contains("dropdown__menu-ustensil-tag")){      
        tagBtn.classList.add("color3");                                         // Add the ustensil background-color to the tag
    }
    if(!e.currentTarget.classList.contains("tag-selected")){   // Create the tag ...
        tagBtn.innerText = e.currentTarget.innerText;
        tagBtn.type = "button";
        tagBtn.appendChild(tagBtnIcon);
        tagList.appendChild(tagBtn.cloneNode(true));
    }
    e.currentTarget.classList.add("tag-selected");              // ... declare the tag selected in the dropdown list
    allFilters = document.querySelectorAll(".tag");
    allSelectedTag = document.querySelectorAll(".btn-filter");
    allSelectedTag.forEach(element => element.addEventListener('click', removeBtn));
}

function removeBtn(e){
    e.currentTarget.remove();                                   // Remove the tag ...
    for(let i=0; i<allFilters.length; i++){
        if(e.currentTarget.innerText == allFilters[i].innerText){
            allFilters[i].classList.remove("tag-selected");     // ... declare that the tag is no longer selected in the dropdown list
        }
    }
    allSelectedTag = document.querySelectorAll(".btn-filter");
    selectedRecipes();
}

const allTags = document.querySelectorAll(".tag");
allTags.forEach(tag => tag.addEventListener('click', createBtn));
allTags.forEach(tag => tag.addEventListener('click', selectedRecipes));

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
        if(allSelectedTag.length == 0){
            cards[i].style.display = "block";
        } else {
            for(let j=0; j<allSelectedTag.length; j++){
                if(!cards[i].innerText.toUpperCase().includes(allSelectedTag[j].innerText.toUpperCase())){
                    cards[i].style.display = "none";
                } else {
                    cards[i].style.display = "block";
                }
            }
        }
    }
    
}