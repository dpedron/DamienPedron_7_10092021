/* Dropdown open/close */

function filterListBtn(e){
    let dropdownBtn = e.currentTarget;
    if(dropdownBtn.parentElement.classList.contains('show-all')){ // The dropdown is open ...  
        dropdownBtn.parentElement.classList.remove('show-all'); // ... close him ...
        if(dropdownBtn.previousElementSibling.previousElementSibling.value == ""){ // ... the input text is empty ...
            dropdownBtn.previousElementSibling.classList.remove('hide'); // ... show dropdown title
        }                                   
    } else {                                              
        dropdownBtn.parentElement.classList.add('show-all'); // The dropdown is close ...
        dropdownBtn.previousElementSibling.classList.add('hide'); // ... open him                                 
    }
}

/* Tag */

function createTag(e){  // Create tag button when the user select a filter
    e.preventDefault();
    const tagBtn = document.createElement("button");
    const tagBtnIcon = document.createElement("img");
    const filters = document.querySelector(".filter-list");
    tagBtn.classList = "btn-filter";
    tagBtnIcon.src = "./images/cross.svg";
    tagBtnIcon.classList = "btn-filter__cross"
    if(e.currentTarget.classList.contains("dropdown__menu-ingredient-filter")){    
        tagBtn.classList.add("color1");                                         // Add the ingredient background-color to the tag
    }
    if(e.currentTarget.classList.contains("dropdown__menu-appliance-filter")){     
        tagBtn.classList.add("color2");                                         // Add the appliance background-color to the tag
    }
    if(e.currentTarget.classList.contains("dropdown__menu-ustensil-filter")){      
        tagBtn.classList.add("color3");                                         // Add the ustensil background-color to the tag
    }
    if(!e.currentTarget.classList.contains("tag-selected")){                    // Create the tag ...
        tagBtn.innerText = e.currentTarget.innerText;
        tagBtn.type = "button";
        tagBtn.appendChild(tagBtnIcon);
        filters.appendChild(tagBtn.cloneNode(true));
    }
    recipesByTags();
    e.currentTarget.classList.add("tag-selected");                              // ... declare the tag selected in the dropdown list 
    allFilters = document.querySelectorAll(".filter");
    allSelectedTag = document.querySelectorAll(".btn-filter");
    allSelectedTag.forEach(element => element.addEventListener('click', removeTag));
    resetInputs();
}


function removeTag(e){
    let allCards = document.querySelectorAll(".card");
    e.currentTarget.remove(); // Remove the tag ...
    for(let i=0; i<allFilters.length; i++){
        if(e.currentTarget.innerText == allFilters[i].innerText){  
            allFilters[i].classList.remove("tag-selected"); // ... the tag is no longer selected in the dropdown list
            for(let j=0; j<allCards.length; j++){
                allCards[j].classList.add("display-recipe");
            }
        }
    }
    allCards.forEach(card => card.style.display = "block");
    allSelectedTag = document.querySelectorAll(".btn-filter");
    recipesByTags();
    resetInputs();
    setTimeout(cropDescriptions, 100);
}

/* Show selected recipes based on selected tag */

function recipesByTags(){
    for (const recipe of recipes) {
        let ingredients = [];
        recipe.ingredients.forEach(ing => ingredients.push(ing.ingredient.toUpperCase())); // Get all recipes ingredients
        for(let k=0; k<allSelectedTag.length; k++){
            if(recipe.appliance.toUpperCase().includes(allSelectedTag[k].innerText.toUpperCase()) || ingredients.join().includes(allSelectedTag[k].innerText.toUpperCase()) || recipe.ustensils.join().toUpperCase().includes(allSelectedTag[k].innerText.toUpperCase())){ // Tags match with one recipe in database or more ...
                if(document.getElementById("recipe-" + recipe.id).classList.contains("display-recipe") && document.getElementById("recipe-" + recipe.id).style.display == "block"){
                    document.getElementById("recipe-" + recipe.id).style.display = "block"; // ... display cards of the recipes ...
                }
            } else {
                document.getElementById("recipe-" + recipe.id).style.display = "none"; // ... hide others
                document.getElementById("recipe-" + recipe.id).classList.remove("display-recipe");
            }
        }
        if(allSelectedTag.length == 0){ // No tag selected ...
            document.querySelectorAll(".card").forEach(card => card.style.display = "block"); // ... display all cards
            document.querySelectorAll(".card").forEach(card => card.classList.add("display-recipe"));
        }
    }
    updateFilters();  // Update filters based on recipes displayed
}

/* No card, display "no recipe" message */

function noRecipe(){
    let displayedCards = [];
    document.querySelectorAll(".card").forEach(card => {
        if(card.style.display == "block"){
            displayedCards.push(card);
        }
    })
    document.querySelector(".no-result").style.display = displayedCards.length == 0? "block":"none";
}

function updateFilters(){  // Update filters based on recipes displayed
    const allFilters = document.querySelectorAll(".filter");
    let allCardsDisplayed = document.querySelectorAll(".card.display-recipe");
    let displayedRecipesID = [];
    let displayedFilters = [];
    allCardsDisplayed.forEach(card => {
        if(card.style.display == "block"){
            displayedRecipesID.push(card.id.substring(7)); // Get all the id of displayed recipes
        }
    });
    displayedRecipesID.forEach(id => { // Get all filters based on displayed recipes        
        displayedFilters.push(recipes[id-1].appliance.toUpperCase(), recipes[id-1].ustensils.join().toUpperCase());
        recipes[id-1].ingredients.forEach(ing => displayedFilters.push(ing.ingredient.toUpperCase()))
    }); 
    allFilters.forEach(filter => filter.classList.remove('filter-displayed')); // Indicate all the filters as "not displayed"
    for(i=0; i<displayedFilters.length; i++){
        for(j=0; j<allFilters.length; j++){
            if(displayedFilters[i].includes(allFilters[j].innerText.toUpperCase())){ // For the filters who match with display recipes ...
                allFilters[j].parentElement.style.display = "block"; // ... display them ...
                allFilters[j].classList.add('filter-displayed'); // ... indicate them as "displayed"
            }
            if(!displayedFilters[i].includes(allFilters[j].innerText.toUpperCase()) && !allFilters[j].classList.contains('filter-displayed')){  // Recipes doesn't includes filter ...
                allFilters[j].parentElement.style.display = "none"; // ... hide them
            }
            for(let k=0; k<allSelectedTag.length; k++){
                if(allSelectedTag[k].innerText.toUpperCase() == allFilters[j].innerText.toUpperCase()){ // The filter is selected ...
                    allFilters[j].parentElement.style.display = "none"; // ... hide him
                }
            }
        }
    }
}

/* Crop description management */

function cropDescriptions(){ // Crop the "original" description by ...
    resetDescription(); // ... add "original" description ...
	document.querySelectorAll(".card__body-description").forEach(function(desc){          
		    multiLineEllipsis(desc); // ... crop and add "..."  
	});
}

function resetDescription(){ // Display the full "original" description in the card
    let allCardsDescription = document.querySelectorAll(".card__body-description");
    for(i=0; i<allCardsDescription.length; i++){
        for(j=0; j<allFullDescriptions.length; j++){
            allCardsDescription[i].innerText = allFullDescriptions[i];
        }
    }
}

function multiLineEllipsis(desc){
	let recipesInstruction = desc.innerText;
	desc.innerText = "";
	let counter = 200;
    if(recipesInstruction.length > 200){ // If the "original" description characters length is more than 200 ...
        while((desc.scrollHeight <= desc.offsetHeight)  && (counter <= recipesInstruction.length)){ // While description container height is less than or equal to description height and the counter is less than or equal to the description...
            counter ++; // ... increment the counter ...
            desc.innerText = recipesInstruction.substring(0,  counter) + "..."; // ... description is equal to 0 to counter number, remove characters over counter number, and add "..." ...
        }
        if(desc.scrollHeight > desc.offsetHeight){ // ... if the description container height is upper to description height remove one characters of the description
            desc.innerText = recipesInstruction.substring(0, counter-1) + "...";
        }
    } else { // The "original" description characters length is less than 200 ...
        desc.innerText = recipesInstruction; // ... display original description
    }
}

let resizeTimer = null;
window.onresize = function(){  // On window resize crop the descriptions of each cards again (responsiv)
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(cropDescriptions, 500);
};

/* Inputs reset */

function resetInputs(){
    document.querySelectorAll(".dropdown").forEach(dropdown => dropdown.classList.remove('show-all')); // Close dropdowns ...
    document.querySelectorAll(".dropdown__input").forEach(input => input.value = ""); // ... empty dropwdowns input text ...
    document.querySelectorAll(".dropdown__input-title").forEach(title => title.classList.remove('hide')); // ... show dropdowns titles ...
    document.querySelectorAll(".no-filter").forEach(elt => elt.classList.add('hide'));  // ... hide "no filter" message in filter list ...
    document.querySelector(".no-result").style.display = "none"; // ... remove "no result" message on recipes section ...
    document.querySelector(".search__input").value = ""; // ... empty main search input text
}

function resetDropdown(e){
    document.querySelector(".search__input").value = ""; // Remove characters of main input when the user search with the dropdown input
    e.currentTarget.nextElementSibling.classList.add('hide');	// Hide dropdown title 
    document.querySelectorAll(".dropdown__input").forEach(elt => {
        if(elt != e.currentTarget){								// Input is not the selected input ...
            elt.value = "";										// ... empty him ...
            elt.parentElement.classList.remove('show-all');		// ... hide the dropdown ...
            elt.nextElementSibling.classList.remove('hide');	// ... show the dropdown title ...
            elt.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.classList.add('hide'); // ... hide "no filter" message in filter list
        }
    })
}