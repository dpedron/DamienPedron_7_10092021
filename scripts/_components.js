function filterList(e){
    let dropdownButton = e.currentTarget;
    if(dropdownButton.parentElement.classList.contains('show-all')){      // The menu is open...
        dropdownButton.nextElementSibling.classList.remove('show');        // ... close him ...       
        dropdownButton.parentElement.classList.remove('show-all');         // ... tighten the dropdown ...
        dropdownButton.firstElementChild.classList.remove('open');         // ... the arrow point down ...
        dropdownButton.previousElementSibling.classList.remove('search-filter'); // ... change placeholder color ...
        e.currentTarget.previousElementSibling.placeholder = e.currentTarget.previousElementSibling.placeholder.substr(13)[0].toUpperCase() + e.currentTarget.previousElementSibling.placeholder.substr(13).slice(1) + "s"; // ... change placeholder text ...
    } else {                                                                // The menu is close ...
        dropdownButton.nextElementSibling.classList.add('show');           // ... scroll down the menu ...
        dropdownButton.parentElement.classList.add('show-all');            // ... widen the dropdown ...
        dropdownButton.firstElementChild.classList.add('open');            // ... the arrow point up ...
        dropdownButton.previousElementSibling.classList.add('search-filter'); // ... change placeholder color ...
        e.currentTarget.previousElementSibling.placeholder = "Recherche un " + e.currentTarget.previousElementSibling.placeholder[0].toLowerCase() + e.currentTarget.previousElementSibling.placeholder.slice(1, -1);   // ... change placeholder text ...
    }
}

/* Filters */

function createFilter(menuElt, menuStyle, tagStyle, data){ // Create all filters for the dropdowns
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

/* Tag button */

function createBtn(e){                                                              // Create tag button when the user select a filter
    e.preventDefault();
    const tagBtn = document.createElement("button");
    const tagBtnIcon = document.createElement("i");
    const tagList = document.querySelector(".tag-list");
    tagBtn.classList = "btn-filter";
    tagBtnIcon.classList = "far fa-times-circle";
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
    let allCards = document.querySelectorAll(".card");
    e.currentTarget.remove();                                              // Remove the tag ...
    for(let i=0; i<allFilters.length; i++){
        if(e.currentTarget.innerText == allFilters[i].innerText){
            allFilters[i].classList.remove("tag-selected");             // ... the tag is no longer selected in the dropdown list
            for(let j=0; j<allCards.length; j++){
                    allCards[j].classList.add("display-recipe");
            }
        }
    }
    allSelectedTag = document.querySelectorAll(".btn-filter");
    selectedRecipes();    
}

/* Show selected recipes */

function selectedRecipes(){
    let allCards = document.querySelectorAll(".card");
    let allCardsDisplayed = document.querySelectorAll(".card.display-recipe");
    for(let i=0; i<allCardsDisplayed.length; i++){        
        if(allSelectedTag.length == 0){                     // No tag selected ...
            allCards[i].style.display = "block";            // ... display all cards ...
            allCards[i].classList.add("display-recipe");    // ... select them
        }
        for(let j=0; j<allSelectedTag.length; j++){
            if(allCardsDisplayed[i].innerText.toUpperCase().includes(allSelectedTag[j].innerText.toUpperCase())){      // The selected tag match with one displayed card or more ...
                allCardsDisplayed[i].style.display = "block";            // ... display cards who match ...
            } else {
                allCardsDisplayed[i].style.display = "none";             // ... hide other ...
                allCardsDisplayed[i].classList.remove("display-recipe"); // ... unselect them              
            }
        }        
    }
    filterDisplay(); 
}


function filterDisplay(){
    const allTags = document.querySelectorAll(".tag");
    let allCardsDisplayed = document.querySelectorAll(".card.display-recipe");
    for(let i=0; i<allTags.length; i++){
        allTags[i].classList.remove('filter-displayed');
        for(let j=0; j<allCardsDisplayed.length; j++){
            if(allCardsDisplayed[j].innerText.toUpperCase().includes(allTags[i].innerText.toUpperCase()) && !allTags[i].classList.contains('filter-displayed')){
                allTags[i].parentElement.style.display = "block";
                allTags[i].classList.add('filter-displayed');
            } 
            if(!allCardsDisplayed[j].innerText.toUpperCase().includes(allTags[i].innerText.toUpperCase()) && !allTags[i].classList.contains('filter-displayed')){
                allTags[i].parentElement.style.display = "none";
            }
        }
        for(let j=0; j<allSelectedTag.length; j++){
            if(allSelectedTag[j].innerText.toUpperCase() == allTags[i].innerText.toUpperCase()){
                allTags[i].parentElement.style.display = "none";
            }
        }
    }
}