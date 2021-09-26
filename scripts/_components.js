function filterList(e){
    let dropdownButton = e.currentTarget;
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

/* Tag */

function createTag(e){  // Create tag button when the user select a filter
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
    if(!e.currentTarget.classList.contains("tag-selected")){                    // Create the tag ...
        tagBtn.innerText = e.currentTarget.innerText;
        tagBtn.type = "button";
        tagBtn.appendChild(tagBtnIcon);
        tagList.appendChild(tagBtn.cloneNode(true));
    }
    e.currentTarget.classList.add("tag-selected");                              // ... declare the tag selected in the dropdown list 
    allFilters = document.querySelectorAll(".tag");
    allSelectedTag = document.querySelectorAll(".btn-filter");
    allSelectedTag.forEach(element => element.addEventListener('click', removeTag));
    e.currentTarget.parentElement.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.value = "";
    filterList();
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
    selectedRecipes();    
}

/* Show selected recipes */

function selectedRecipes(){
    let allCards = document.querySelectorAll(".card");
    let allCardsDisplayed = document.querySelectorAll(".card.display-recipe");
    for(let i=0; i<allCardsDisplayed.length; i++){        
        if(allSelectedTag.length == 0){                                 // No tag selected ...
            allCards[i].style.display = "block";                        // ... display all cards ...
            allCards[i].classList.add("display-recipe");                // ... select them
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

function multiLineEllipsis(desc){
    let recipesInstruction = desc.innerText;
    desc.innerText = "";
    let counter = 0;
    while((desc.scrollHeight <= desc.offsetHeight)  && (counter<=recipesInstruction.length)){
        counter ++;
        desc.innerText = recipesInstruction.substring(0,  counter) + "...";
    }
    if(desc.scrollHeight > desc.offsetHeight){
        desc.innerText = recipesInstruction.substring(0, counter-1) + "...";
    }
}