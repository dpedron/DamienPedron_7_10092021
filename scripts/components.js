/* Dropdown open/close */

function filterListBtn(e){
    if(e.currentTarget.parentElement.classList.contains('show-all')){       
        e.currentTarget.parentElement.classList.remove('show-all');
        if(e.currentTarget.previousElementSibling.previousElementSibling.value == ""){
            e.currentTarget.previousElementSibling.classList.remove('hide');     
        }                                   
    } else {                                              
        e.currentTarget.parentElement.classList.add('show-all');
        e.currentTarget.previousElementSibling.classList.add('hide');                                 
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
    e.currentTarget.classList.add("tag-selected");                              // ... declare the tag selected in the dropdown list 
    allFilters = document.querySelectorAll(".filter");
    allSelectedTag = document.querySelectorAll(".btn-filter");
    allSelectedTag.forEach(element => element.addEventListener('click', removeTag));
    e.currentTarget.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.value = "";
    resetInputs();
}

function removeTag(e){
    let allCards = document.querySelectorAll(".card");
    e.currentTarget.remove();                                               // Remove the tag ...
    for(let i=0; i<allFilters.length; i++){
        if(e.currentTarget.innerText == allFilters[i].innerText){
            allFilters[i].classList.remove("tag-selected");                 // ... the tag is no longer selected in the dropdown list
            for(let j=0; j<allCards.length; j++){
                    allCards[j].classList.add("display-recipe");
            }
        }
    }
    allSelectedTag = document.querySelectorAll(".btn-filter");
    selectedRecipes();    // Show selected recipes based on selected tag
    resetInputs();
}

function resetInputs(){
    document.querySelectorAll(".dropdown").forEach(dropdown => dropdown.classList.remove('show-all'));
    document.querySelectorAll(".dropdown__input-title").forEach(title => title.classList.remove('hide'));
    document.querySelector(".search__input").value = "";
}

/* Show selected recipes */

function selectedRecipes(){ // Show selected recipes based on selected tag
    let allCards = document.querySelectorAll(".card");
    let allCardsDisplayed = document.querySelectorAll(".card.display-recipe");
    document.querySelector('.no-result').style.display = "none";
    for(let i=0; i<allCardsDisplayed.length; i++){        
        if(allSelectedTag.length == 0){                                 // No tag selected ...
            allCards[i].style.display = "block";                        // ... display all cards
            allCards[i].classList.add("display-recipe");
        }
        for(let j=0; j<allSelectedTag.length; j++){
            if(allCardsDisplayed[i].innerText.toUpperCase().includes(allSelectedTag[j].innerText.toUpperCase())){      // The selected tag match with one displayed card or more ...
                allCardsDisplayed[i].style.display = "block";            // ... display cards who match ...
            } else {
                allCardsDisplayed[i].style.display = "none";             // ... hide other
                allCardsDisplayed[i].classList.remove("display-recipe");            
            }
        }
    }
    updateFilters();  // Update filters based on recipes displayed
}


/* function updateFilters(){  // Update filters based on recipes displayed
    const allFilters = document.querySelectorAll(".filter");
    let allCardsDisplayed = document.querySelectorAll(".card.display-recipe");
    for(let i=0; i<allFilters.length; i++){
        allFilters[i].classList.remove('filter-displayed'); // Hide all filter
        for(let j=0; j<allCardsDisplayed.length; j++){
            if(allCardsDisplayed[j].innerText.toUpperCase().includes(allFilters[i].innerText.toUpperCase()) && !allFilters[i].classList.contains('filter-displayed')){   // Recipes includes filter ...
                allFilters[i].parentElement.style.display = "block"; // ... display them
                allFilters[i].classList.add('filter-displayed');
            } 
            if(!allCardsDisplayed[j].innerText.toUpperCase().includes(allFilters[i].innerText.toUpperCase()) && !allFilters[i].classList.contains('filter-displayed')){  // Recipes doesn't includes filter ...
                allFilters[i].parentElement.style.display = "none"; // ... hide them
            }
        }
        for(let j=0; j<allSelectedTag.length; j++){
            if(allSelectedTag[j].innerText.toUpperCase() == allFilters[i].innerText.toUpperCase()){ // The filter is selected ...
                allFilters[i].parentElement.style.display = "none"; // ... hide him
            }
        }
    }
} */

function updateFilters(){  // Update filters based on recipes displayed
    const allFilters = document.querySelectorAll(".filter");
    let allCardsDisplayed = document.querySelectorAll(".card.display-recipe");
    for(let i=0; i<allFilters.length; i++){
        allFilters[i].classList.remove('filter-displayed'); // Hide all filter 
        for(let j=0; j<allCardsDisplayed.length; j++){
            if(allCardsDisplayed[j].innerText.toUpperCase().includes(allFilters[i].innerText.toUpperCase())){   // Recipes includes filter ...
                allFilters[i].parentElement.style.display = "block"; // ... display them
                allFilters[i].classList.add('filter-displayed');
            } 
            if(!allCardsDisplayed[j].innerText.toUpperCase().includes(allFilters[i].innerText.toUpperCase()) && !allFilters[i].classList.contains('filter-displayed')){  // Recipes doesn't includes filter ...
                allFilters[i].parentElement.style.display = "none"; // ... hide them
            }
        }
        for(let j=0; j<allSelectedTag.length; j++){
            if(allSelectedTag[j].innerText.toUpperCase() == allFilters[i].innerText.toUpperCase()){ // The filter is selected ...
                allFilters[i].parentElement.style.display = "none"; // ... hide him
            }
        }
    }
}

function cropDescriptions(){
    resetDescription();
	document.querySelectorAll(".card__body-description").forEach(function(desc){          
		    multiLineEllipsis(desc);    
	});
}

function resetDescription(){
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
	let counter = 100;
	while((desc.scrollHeight <= desc.offsetHeight)  && (counter <= recipesInstruction.length)){
		counter ++;
		desc.innerText = recipesInstruction.substring(0,  counter) + "...";
	}
	if(desc.scrollHeight > desc.offsetHeight){
		desc.innerText = recipesInstruction.substring(0, counter-1) + "...";
	}
}

let resizeTimer = null;
window.onresize = function()
{
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(cropDescriptions, 500);
};

function resetDropdown(e){
    document.querySelector(".search__input").value = ""; // Remove characters of main input when the user search with the dropdown input
    e.currentTarget.nextElementSibling.classList.add('hide');	// Hide dropdown title 
    document.querySelectorAll(".dropdown__input").forEach(elt => {
    if(elt != e.currentTarget){								// Input is not the selected input ...
        elt.value = "";										// ... empty him ...
        elt.parentElement.classList.remove('show-all');		// ... hide the dropdown ...
        elt.nextElementSibling.classList.remove('hide');	// ... show the dropdown title   
        elt.nextElementSibling.nextElementSibling.nextElementSibling.firstElementChild.classList.add('hide');
    }
})
}