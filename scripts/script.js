let allSelectedTag = [];
let allFilters = [];

window.onload = function(){
	init();
};

function init(){

	/* Recipes cards DOM */

	const recipesResults = document.querySelector(".recipes-results");
	const card = document.createElement("div");
	card.classList = "card display-recipe";
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
	let allIngredients = [];
	let allAppliances = [];
	let allUstensils = [];

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
					if(recipes[i].ingredients[j].quantity == null && recipes[i].ingredients[j].unit == null){
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

	window.setTimeout(cropDescriptions, 100);



	

	/* Get all filters (ingredients, appliances and ustensils) with the first letter in uppercase and others in lowercase ... */

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

	/* ... sort them by alphabetical order */

	let allUniqueIngredients = [...new Set(allIngredients)].sort();
	let allUniqueAppliances = [...new Set(allAppliances)].sort();
	let allUniqueUstensils = [...new Set(allUstensils)].sort();

	/* Filters DOM*/

	function createFilter(menuElt, menuStyle, filterStyle, data){ // Create all filters for the dropdowns
		const p = document.createElement("p");
		p.classList = menuStyle + " dropdown__menu-filter";
		const filter = document.createElement("a");
		filter.classList = filterStyle + " filter filter-displayed";

		for(let i=0; i<data.length; i++){
			filter.innerHTML = data[i];
			filter.href = data[i];
			p.appendChild(filter);
			menuElt.appendChild(p.cloneNode(true));
		}
	}
	
	createFilter(document.querySelector(".dropdown__menu-ingredients"),"dropdown__menu-ingredient", "dropdown__menu-ingredient-filter", allUniqueIngredients);	

	createFilter(document.querySelector(".dropdown__menu-appliances"),"dropdown__menu-appliance", "dropdown__menu-appliance-filter", allUniqueAppliances);

	createFilter(document.querySelector(".dropdown__menu-ustensils"), "dropdown__menu-ustensil", "dropdown__menu-ustensil-filter", allUniqueUstensils);

	/* Tags */

	const allFilters = document.querySelectorAll(".filter");
	allFilters.forEach(filter => filter.addEventListener('click', createTag)); // Create tag
	allFilters.forEach(filter => filter.addEventListener('click', selectedRecipes)); // Show recipes who match with selected tag

	/* Dropdown open/close */

	let dropdownsBtn = document.querySelectorAll('.dropdown__btn');
	dropdownsBtn.forEach(btn => btn.addEventListener('click', filterList));	

	/* Main search */

	document.querySelector(".search__input").addEventListener('input', mainSearch);

	function mainSearch(e){
		let allCardsDisplayed = document.querySelectorAll(".card.display-recipe");
		userSearch = e.currentTarget.value.toUpperCase();
		selectedRecipes(); // Show selected recipes based on selected tag & show filters based on recipes displayed
		if(userSearch.length > 2){
			searchWithFilter(document.querySelectorAll(".dropdown__menu-filter"), allFilters); // Show filters who match with user search
			for(let i=0; i<allCardsDisplayed.length; i++){
				if(allCardsDisplayed[i].innerText.toUpperCase().includes(userSearch)){      // The user search match with one displayed card or more ...
						allCardsDisplayed[i].style.display = "block";            			// ... display cards who match ...
				} else {
						allCardsDisplayed[i].style.display = "none";             			// ... hide others            
				}
			}  
		}
	}

	/* Search with filter */

	let userSearch = null;

	function searchWithFilter(menuElt, data){
		let nbResult = 0;                                                   	// Number of filter found by search
		for(let i=0; i<data.length; i++){
			if(menuElt[i].innerText.toUpperCase().includes(userSearch) && allFilters[i].classList.contains('filter-displayed')){    	// Typed characters match with some displayed filter ...
					menuElt[i].style.display = "block";                         // ... display them ...
					nbResult ++;                                                // ... increment the number of results
			} else {                                                        	// No match ...
					menuElt[i].style.display = "none";                          // ... hide the filter
			}
			if(nbResult > 0 && userSearch.length != 0){                                     // 1 or more filter match ...
					menuElt[i].parentElement.classList.add('show');                         // ... open the dropdown and show them ...
					menuElt[i].parentElement.parentElement.classList.add('show-all');
			} else {                                                                    // No filter match ...  
					menuElt[i].parentElement.classList.remove('show');                      // ... close dropdown
					menuElt[i].parentElement.parentElement.classList.remove('show-all');
			}
		}
	}

	function ingredientSearch(e){
		userSearch = e.currentTarget.value.toUpperCase();
		selectedRecipes(); // Show selected recipes based on selected tag
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ingredient"), allUniqueIngredients);
	}

	function applianceSearch(e){
		userSearch = e.currentTarget.value.toUpperCase();
		selectedRecipes(); // Show selected recipes based on selected tag
		searchWithFilter(document.querySelectorAll(".dropdown__menu-appliance"), allUniqueAppliances);
	}

	function ustensilSearch(e){
		userSearch = e.currentTarget.value.toUpperCase();
		selectedRecipes(); // Show selected recipes based on selected tag
		searchWithFilter(document.querySelectorAll(".dropdown__menu-ustensil"), allUniqueUstensils);
	}

	document.querySelectorAll(".dropdown__input-title").forEach(element => element.addEventListener('click', (e) => {
		e.currentTarget.style.display = "none";
		e.currentTarget.previousElementSibling.focus();
	}));
	document.querySelectorAll(".dropdown__input").forEach(element => element.addEventListener('focus', () => {
			element.nextElementSibling.style.display = "none";
	}));
	document.querySelectorAll(".dropdown__input").forEach(element => element.addEventListener('focusout', () => {
		if(element.value == "" && !element.parentElement.classList.contains("show-all")){
			element.nextElementSibling.style.display = "block";
		}
	}));
	document.querySelector(".dropdown__input.color1").addEventListener('input', ingredientSearch);
	document.querySelector(".dropdown__input.color2").addEventListener('input', applianceSearch);
	document.querySelector(".dropdown__input.color3").addEventListener('input', ustensilSearch);
}

function cropDescriptions(){
	document.querySelectorAll(".card__body-description").forEach(function(desc){
		multiLineEllipsis(desc);
	});
}

function multiLineEllipsis(desc){
	let recipesInstruction = desc.innerText;
	desc.innerText = "";
	let counter = 100;
	while((desc.scrollHeight <= desc.offsetHeight)  && (counter<=recipesInstruction.length)){
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

/* document.addEventListener("click", dropdownClickOut);

function dropdownClickOut(e){
	const flyoutEl = document.querySelectorAll(".dropdown");
	let targetEl = e.target; // clicked element 

	for(let i=0; i<flyoutEl.length; i++){
		if(flyoutEl[i].classList.contains("show-all")){
			do {
			if(targetEl == flyoutEl[i]) {
				// This is a click inside, does nothing, just return.
				console.log("Clicked inside!");
				return;
			}
			// Go up the DOM
			targetEl = targetEl.parentNode;
			} while (targetEl);
			// This is a click outside.      
			flyoutEl[i].classList.remove("show-all");
			console.log(flyoutEl[i].childNodes.querySelector(".dropdown__input"))
			document.querySelector(".dropdown__menu").classList.remove("show");
			document.querySelector(".fas.fa-chevron-down").classList.remove('open');
			document.querySelector(".dropdown__input-title").style.display = "block";
			document.querySelector(".dropdown__input").classList.remove('search-filter');
			document.querySelector(".dropdown__input").value ="";

		}
	}
	
  }; */