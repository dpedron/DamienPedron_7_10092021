/* Dropdown open/close */

function filterList(e){
    let dropdownButton = e.currentTarget;
    switchDropdown(dropdownButton);
}

function switchDropdown(dropdownButton){
    let dropdown = dropdownButton.parentElement;
    let dropdownArrow = dropdownButton.firstElementChild;
    let dropdownTitle = dropdownButton.previousElementSibling;
    let dropdownInput = dropdownButton.previousElementSibling.previousElementSibling;
    let dropdownList = dropdownButton.nextElementSibling;
    if(dropdown.classList.contains('show-all')){            // The menu is open...
        dropdownList.classList.remove('show');                              // ... close him ...       
        dropdown.classList.remove('show-all');                              // ... tighten the dropdown ...
        dropdownArrow.classList.remove('open');                             // ... the arrow point down ...
        dropdownTitle.style.display = "block";                              // ... show input tilte ...
        dropdownInput.classList.remove('search-filter');                    // ... remove placeholder
    } else {                                              // The menu is close ...
        dropdownList.classList.add('show');                                 // ... scroll down the menu ...
        dropdown.classList.add('show-all');                                 // ... widen the dropdown ...
        dropdownArrow.classList.add('open');                                // ... the arrow point up ...
        dropdownTitle.style.display = "none";                               // ... remove input title ...
        dropdownInput.classList.add('search-filter');                       // ... show placeholder
    }
}

/* Tag */

function createTag(e){  // Create tag button when the user select a filter
    e.preventDefault();
    const tagBtn = document.createElement("button");
    const tagBtnIcon = document.createElement("i");
    const filters = document.querySelector(".filter-list");
    tagBtn.classList = "btn-filter";
    tagBtnIcon.classList = "far fa-times-circle";
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
}

/* Show selected recipes */

function selectedRecipes(){ // Show selected recipes based on selected tag
    let allCards = document.querySelectorAll(".card");
    let allCardsDisplayed = document.querySelectorAll(".card.display-recipe");
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

function updateFilters(){  // Update filters based on recipes displayed
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
}