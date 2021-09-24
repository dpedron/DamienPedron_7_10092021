
/* Cards creation */

let allSelectedTag = [];
let allFilters = [];

window.onload = function(){
	init();
};

function init(){
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
			console.log(cardDescription.scrollHeight)
	}

	document.querySelectorAll(".card__body-description").forEach(function(desc){
		multiLineEllipsis(desc);
	  });

	/* Dropdown */

	let dropdownsBtn = document.querySelectorAll('.dropdown__btn');
	dropdownsBtn.forEach(btn => btn.addEventListener('click', filterList));

	/* Get all ingredients, appliances and ustensils with the first letter in uppercase and others in lowercase */

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

	const allTags = document.querySelectorAll(".tag");
	allTags.forEach(tag => tag.addEventListener('click', createBtn));
	allTags.forEach(tag => tag.addEventListener('click', selectedRecipes));

	/* Search */

	let userSearch = null;

	function searchWithFilter(menuElt, data){
		let nbResult = 0;                                                   	// Number of filter found by search
		for(let i=0; i<data.length; i++){
			if(menuElt[i].innerText.toUpperCase().includes(userSearch)){    	// The characters typed by the user match with some filter ...
					menuElt[i].style.display = "block";                         // ... display them ...
					nbResult ++;                                                // ... increment the number of results
			} else {                                                        	// No match ...
					menuElt[i].style.display = "none";                          // ... hide the filter
			}
			if(nbResult > 0){                                                           // 1 or more filter match ...
					menuElt[i].parentElement.classList.add('show');                         // ... open the dropdown and show them ...
					menuElt[i].parentElement.parentElement.classList.add('show-all');
			} else {                                                                    // No filter match ...  
					menuElt[i].parentElement.classList.remove('show');                      // ... close dropdown
					menuElt[i].parentElement.parentElement.classList.remove('show-all');
			}
		}
	}

	function displayAllFilters(menuElt, data){
		for(let i=0; i<data.length; i++){
				menuElt[i].style.display = "block";
				menuElt[i].parentElement.classList.remove('show');
				menuElt[i].parentElement.parentElement.classList.remove('show-all');
		}
	}

	/* Main search */

	document.querySelector(".search__input").addEventListener('input', mainSearch);

	function mainSearch(e){
		let allCardsDisplayed = document.querySelectorAll(".card.display-recipe");
		userSearch = e.currentTarget.value.toUpperCase();
		selectedRecipes();
		if(userSearch.length > 2){
			searchWithFilter(document.querySelectorAll(".dropdown__menu-ingredient"), allUniqueIngredients);
			searchWithFilter(document.querySelectorAll(".dropdown__menu-appliance"), allUniqueAppliances);
			searchWithFilter(document.querySelectorAll(".dropdown__menu-ustensil"), allUniqueUstensils);
			for(let i=0; i< allCardsDisplayed.length; i++){
				if(allCardsDisplayed[i].innerText.toUpperCase().includes(userSearch)){      // The user search match with one displayed card or more ...
						allCardsDisplayed[i].style.display = "block";            			// ... display cards who match ...
				} else {
						allCardsDisplayed[i].style.display = "none";             			// ... hide others            
				}
			}  
		} else {
			displayAllFilters(document.querySelectorAll(".dropdown__menu-ingredient"), allUniqueIngredients);
			displayAllFilters(document.querySelectorAll(".dropdown__menu-appliance"), allUniqueAppliances);
			displayAllFilters(document.querySelectorAll(".dropdown__menu-ustensil"), allUniqueUstensils);
		}
	}

	/* Tag search */

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

	/* document.querySelectorAll(".dropdown__input").addEventListener('input', filterSearch);
	
	function filterSearch(menuElt, data, e){
			userSearch = e.currentTarget.value.toUpperCase();
			if(userSearch.length > 0){
					searchWithFilter(menuElt, data);
					selectedRecipes();
			} else {
					displayAll(menuElt, data);
			}
	} */

	function ingredientSearch(e){
		userSearch = e.currentTarget.value.toUpperCase();
		selectedRecipes();
		if(userSearch.length > 0){
				searchWithFilter(document.querySelectorAll(".dropdown__menu-ingredient"), allUniqueIngredients);
		} else {
				displayAllFilters(document.querySelectorAll(".dropdown__menu-ingredient"), allUniqueIngredients);
		}
	}

	function applianceSearch(e){
		userSearch = e.currentTarget.value.toUpperCase();
		selectedRecipes();
		if(userSearch.length > 0){
				searchWithFilter(document.querySelectorAll(".dropdown__menu-appliance"), allUniqueAppliances);
		} else {
				displayAllFilters(document.querySelectorAll(".dropdown__menu-appliance"), allUniqueAppliances);
		}
	}

	function ustensilSearch(e){
		userSearch = e.currentTarget.value.toUpperCase();
		selectedRecipes();
		if(userSearch.length > 0){
				searchWithFilter(document.querySelectorAll(".dropdown__menu-ustensil"), allUniqueUstensils);
		} else {
				displayAllFilters(document.querySelectorAll(".dropdown__menu-ustensil"), allUniqueUstensils);
		}
	}
}